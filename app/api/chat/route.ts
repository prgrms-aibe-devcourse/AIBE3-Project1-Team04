import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 여행 관련이 아닌 질문을 차단
const isTravelQuery = (text: string) => {
  const banned = ['코딩', '수학', '철학', 'AI', 'GPT', '정치', '논문', '문법'];
  return !banned.some((kw) => text.toLowerCase().includes(kw));
};

// 사용자 질문에서 지역/일정/예산 추출
const extractPrompt = `
너는 여행 추천 도우미야.
사용자의 질문에서 다음 정보를 추출해서 JSON 형식으로만 응답해.
- 지역(region): 예) 서울, 제주도
- 일정 일 수(days): 정수
- 예산(budget): 정수, 없으면 null
예: { "region": "서울", "days": 3, "budget": 300000 }
`;

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });
  }

  // 여행 관련 질문만 허용
  if (!isTravelQuery(message)) {
    return NextResponse.json({
      reply: '죄송합니다. 저는 여행 추천 도우미이기 때문에 여행 관련 질문만 도와드릴 수 있어요.',
    });
  }

  try {
    // 1️⃣ GPT로부터 정보 추출
    const extractRes = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: extractPrompt },
        { role: 'user', content: message },
      ],
    });

    const content = extractRes.choices[0]?.message?.content ?? '{}';
    const { region, days, budget } = JSON.parse(content);

    // 2️⃣ 지역 또는 일정 누락된 경우 → GPT가 자유롭게 추천
    if (!region || !days) {
      const fallbackFreePrompt = `
너는 여행 플래너야.
사용자의 요청에 맞게 국내 인기 여행지를 기반으로 2박 3일 일정을 추천해줘.
예산은 여유가 있다고 가정해. 친절한 말투로 정리해줘.
`.trim();

      const fallbackRes = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: fallbackFreePrompt },
          { role: 'user', content: message },
        ],
      });

      const fallback =
        fallbackRes.choices[0]?.message?.content ?? '추천 일정을 생성하지 못했습니다.';
      return NextResponse.json({
        reply: `📌 조건이 명확하지 않아 기본 여행 일정을 추천드릴게요!\n\n${fallback}`,
      });
    }

    // 3️⃣ Supabase에서 추천 일정 조회
    const { data, error } = await supabase
      .from('recommendations')
      .select('*')
      .ilike('region', `%${region}%`)
      .gte('days', days)
      .lte('budget', budget ?? 99999999)
      .order('created_at', { ascending: false })
      .limit(1);

    // 4️⃣ Supabase에 없으면 → GPT로 일정 생성
    if (error || !data || data.length === 0) {
      const fallbackPrompt = `
너는 여행 플래너야.
아래 조건에 맞춰 하루 단위로 여행 일정을 요약해서 제안해줘.

- 지역: ${region}
- 일정: ${days}일
- 예산: ${budget ?? '제한 없음'}

출력 예시:
📍 ${region} ${days}일 여행 추천

- 1일차: ...
- 2일차: ...
...

예산도 요약해서 맨 아래에 붙여줘.
      `.trim();

      const planRes = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: fallbackPrompt },
          { role: 'user', content: message },
        ],
      });

      const plan = planRes.choices[0].message.content ?? '추천 일정을 생성하지 못했습니다.';
      return NextResponse.json({
        reply: `🔍 조건에 맞는 게시글이 없어, GPT가 여행 일정을 대신 추천드릴게요!\n\n${plan}`,
      });
    }

    // 5️⃣ Supabase 추천 결과 응답
    return NextResponse.json({
      reply: `📍 ${region} 여행 일정 추천입니다!\n\n${data[0].recommend_text}`,
    });
  } catch (err: any) {
    if (err?.status === 429) {
      return NextResponse.json(
        { reply: 'GPT API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.' },
        { status: 429 }
      );
    }

    console.error('[GPT ROUTE ERROR]', err);
    return NextResponse.json({ error: '서버 오류 발생' }, { status: 500 });
  }
}
