export default defineEventHandler(async (event) => {
    const cookie = getCookie(event, 'user');

    if (cookie) {
        return {
            user: 'test',
            id: 'test',
            name: 'test',
            first_name: 'John',
            last_name: 'Doe',
        }
    } else {
        setResponseStatus(event, 403, "Unauthenticated");
        return {message: 'Unuthenticated'}
    }
});