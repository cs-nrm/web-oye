const API_URL = import.meta.env.PUBLIC_API_URL;

export async function fetchAPI( query='' ) {
    const res = await fetch( `${API_URL}/${query}` );

    if ( res.ok ) {
        return res.json();
    } else {
        const error = await res.json();

        throw new Error(
            '❗ Failed to fetch API for ' + query + "\n" +
            'Code: ' + error.code + "\n" +
            'Message: ' + error.message + "\n"
        );
    }
}

export async function getArticles() {
    const data = await fetchAPI( 'posts?_embed&per_page=30&_fields[]=title&_fields[]=slug&_fields[]=content' );

    return data;
}