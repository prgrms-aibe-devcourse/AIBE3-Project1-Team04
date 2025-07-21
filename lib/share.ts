export const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다!');
  } catch (error) {
    console.error(`링크 복사 실패 에러: ` + error);
    alert('복사에 실패했습니다 😢');
  }
};

export const copyPlaceUrlToClipboard = async (placeId: number) => {
  try {
    const base = window.location.origin;
    const url = `${base}/places/${placeId}`;
    await navigator.clipboard.writeText(url);
    alert('링크가 복사되었습니다!');
  } catch (error) {
    console.error(`링크 복사 실패 에러: ` + error);
    alert('복사에 실패했습니다 😢');
  }
};
