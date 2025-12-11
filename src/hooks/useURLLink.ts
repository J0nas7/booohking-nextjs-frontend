export const useURLLink = (URLLink: string) => {
    const linkId = URLLink?.split('-')[0]
    const linkName = URLLink?.substring(URLLink.indexOf('-') + 1)

    const convertURLFormat = (id: number, name: string) => {
        name = (name ?? '').replace(/[^a-zA-Z0-9\- ]/g, '').replace(/\s+/g, '-');//.toLowerCase();

        return `${id}-${name}`;
    }

    return {
        linkId,
        linkName,
        convertURLFormat
    };
};
