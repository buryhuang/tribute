export const htmlToString = (content) => {
    return content.replace(/<[^>]+>/g, '');
}
export const textToHyperlink = (string) => {
    if(!string) return;

    let urlRegex = /(((https?:\/\/)|(www.))[^\s]+)/g;
    return string.replace(urlRegex, function (url) {
        let hyperlink = url;
        if (!hyperlink.match('^https?:\\/\\/')) {
            hyperlink = 'http://' + hyperlink;
        }

        return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer" class="underline text-primary-500 hover:text-primary-600">${url}</a>`;
    });
}