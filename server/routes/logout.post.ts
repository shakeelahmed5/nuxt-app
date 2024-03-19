export default defineEventHandler(async (event) => {
    deleteCookie(event, 'user');

    return {
        success: true,
    }
});