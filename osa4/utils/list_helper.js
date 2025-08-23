const dummy = blogs => {
    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((sum, curBlog) => sum + curBlog.likes, 0)
}

const favoriteBlog = blogs => {
    if (blogs.length === 0) {
        return null
    }
    
    return blogs.reduce((mostLiked, blog) => 
        blog.likes > mostLiked.likes ? blog : mostLiked
    )
}

module.exports = { dummy, totalLikes, favoriteBlog }