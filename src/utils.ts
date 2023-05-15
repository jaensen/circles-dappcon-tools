export function jumpToAnchor(className) {
    const element = document.querySelector(`.${className}`);
    if (element) {
        const topOffset = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
}
