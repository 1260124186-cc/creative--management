import { test, expect } from '@playwright/test';

test('页面加载测试', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // 检查页面标题
  await expect(page).toHaveTitle(/创意管理与协作系统/);
  
  // 检查头部标题
  await expect(page.getByText('创意管理与协作系统')).toBeVisible();
  
  // 检查表单元素
  await expect(page.getByLabel('创意标题')).toBeVisible();
  await expect(page.getByLabel('创意描述')).toBeVisible();
  await expect(page.getByRole('button', { name: '提交创意' })).toBeVisible();
});

test('创意提交测试', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // 填写表单
  await page.getByLabel('创意标题').fill('测试创意标题');
  await page.getByLabel('创意描述').fill('这是一个测试创意的详细描述');
  
  // 提交表单
  await page.getByRole('button', { name: '提交创意' }).click();
  
  // 检查创意是否添加成功
  await expect(page.getByText('测试创意标题')).toBeVisible();
  await expect(page.getByText('这是一个测试创意的详细描述')).toBeVisible();
});

test('创意编辑测试', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // 首先添加一个创意
  await page.getByLabel('创意标题').fill('待编辑的创意');
  await page.getByLabel('创意描述').fill('待编辑的创意描述');
  await page.getByRole('button', { name: '提交创意' }).click();
  
  // 点击编辑按钮
  await page.getByRole('button', { name: '编辑' }).click();
  
  // 检查编辑状态
  await expect(page.getByText('编辑创意')).toBeVisible();
  
  // 修改内容
  await page.getByLabel('创意标题').fill('已编辑的创意');
  await page.getByLabel('创意描述').fill('已编辑的创意描述');
  
  // 提交更新
  await page.getByRole('button', { name: '更新创意' }).click();
  
  // 检查更新后的内容
  await expect(page.getByText('已编辑的创意')).toBeVisible();
  await expect(page.getByText('已编辑的创意描述')).toBeVisible();
});

test('创意删除测试', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // 首先添加一个创意
  await page.getByLabel('创意标题').fill('待删除的创意');
  await page.getByLabel('创意描述').fill('待删除的创意描述');
  await page.getByRole('button', { name: '提交创意' }).click();
  
  // 点击删除按钮
  await page.getByRole('button', { name: '删除' }).click();
  
  // 检查创意是否被删除
  await expect(page.getByText('待删除的创意')).not.toBeVisible();
});
