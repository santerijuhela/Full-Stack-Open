const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((sum, curBlog) => sum + curBlog.likes, 0)
}

module.exports = { dummy, totalLikes }