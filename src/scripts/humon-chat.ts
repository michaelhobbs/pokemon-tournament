/** Bind the click + keyboard chat on a HUMON element (ceefax header or homepage). */
export function bindHumonChat(humon: HTMLElement): void {
  if (humon.dataset.humonChat === "1") return;
  humon.dataset.humonChat = "1";

  const isLinkTarget = (event: Event): boolean => {
    const target = event.target as HTMLElement | null;
    return (
      !!target && typeof target.closest === "function" && !!target.closest("a")
    );
  };

  let msgIndex = 0;
  const talk = (event?: Event): void => {
    if (event && isLinkTarget(event)) return;
    msgIndex = (msgIndex + 1) % 3;
    if (msgIndex === 0) {
      humon.classList.remove("is-talking", "is-talking-two");
    } else {
      humon.classList.add("is-talking");
      humon.classList.toggle("is-talking-two", msgIndex === 2);
    }
  };

  humon.addEventListener("click", talk);
  humon.addEventListener("keydown", (event) => {
    if (isLinkTarget(event)) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      talk(event);
    }
  });
}
