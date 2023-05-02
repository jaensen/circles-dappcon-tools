export function jumpToAnchor(anchor) {
    const anchorElements = document.getElementsByTagName("a");
    const anchorElement = Array.from(anchorElements).find((o) => o.name === anchor);
    if (anchorElement) {
        anchorElement.scrollIntoView({ behavior: "smooth" });
        document.location.hash = anchor;
    }
}
//# sourceMappingURL=utils.js.map