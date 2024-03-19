export default defineEventHandler(async (event) => {
    setCookie(event, 'user', true);

    return {
        user: 'test',
        id: 'test',
        name: 'test',
        first_name: 'John',
        last_name: 'Doe',
    }
});