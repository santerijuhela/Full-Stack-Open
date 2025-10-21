const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'root')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()

      const notification = page.getByText('Wrong credentials')
      await expect(notification).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'Blog created by playwright', 'Pauly Playwright', 'https://playwright.blogtest.net')

        await expect(page.getByText('a new blog Blog created by playwright by Pauly Playwright added')).toBeVisible()
        await expect(page.getByText('Blog created by playwright Pauly Playwright')).toBeVisible()
      })

      describe('and a blog exists', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'Blog created by playwright', 'Pauly Playwright', 'https://playwright.blogtest.net')
        })

        test('blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'like' }).click()
          await page.getByText('likes 1').waitFor()
          await page.getByRole('button', { name: 'like' }).click()

          await expect(page.getByText('likes 2')).toBeVisible()
        })

        test('blog can be deleted by the user who added it', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          page.on('dialog', dialog => dialog.accept())
          await page.getByRole('button', { name: 'remove' }).click()

          const notification = page.getByText('Removed Blog created by playwright')
          await expect(notification).toHaveCSS('color', 'rgb(0, 128, 0)')
          await expect(page.getByText('Blog created by playwright Pauly Playwright')).not.toBeVisible()
        })
      })
    })
  })
})