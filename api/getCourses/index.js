module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const courses = [
        { id: 1, title: 'Introduction to React', description: 'Learn React basics' },
        { id: 2, title: 'Advanced TypeScript', description: 'Deep dive into TypeScript' }
    ];

    context.res = {
        status: 200,
        body: courses
    };
};