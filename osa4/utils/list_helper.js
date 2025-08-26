const _ = require('lodash')

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

const mostBlogs = blogs => {
    if (blogs.length === 0) {
        return null
    }

    const counted = _.countBy(blogs, 'author')
    mostBloggedAuthor = _.maxBy(Object.keys(counted), author => counted[author])

    return {
        author: mostBloggedAuthor,
        blogs: counted[mostBloggedAuthor]
    }
}

const mostLikes = blogs => {
    if (blogs.length === 0) {
        return null
    }

    const likesByAuthor = blogs.reduce((result, blog) => {
        result[blog.author] = (result[blog.author] || 0) + blog.likes
        return result
    }, {})
    const mostLikedAuthor = _.maxBy(Object.keys(likesByAuthor), author => likesByAuthor[author])
    return {
        author: mostLikedAuthor,
        likes: likesByAuthor[mostLikedAuthor]
    }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }