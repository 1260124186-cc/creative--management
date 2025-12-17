import { test, expect } from '@playwright/test';

// 所有测试统一通过 Playwright 配置中的 baseURL 访问首页
// 这样如果端口或域名调整，只需修改配置文件即可

test('页面基础布局与弹窗表单', async ({ page }) => {
  await page.goto('http://localhost:8080/');

  // 页面标题与头部文案（标题可能为“创意管理系统”或“创意管理与协作系统”，用模糊匹配）
  await expect(page).toHaveTitle(/创意管理/);
  await expect(page.getByText('创意管理与协作系统')).toBeVisible();

  // Banner 与发表创意按钮（标题为二级 heading）
  await expect(
    page.getByRole('heading', { name: '创意管理与协作' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: '发表创意' })).toBeVisible();

  // 打开新增创意弹窗
  await page.getByRole('button', { name: '发表创意' }).click();

  // 检查表单元素
  await expect(page.getByLabel('创意标题')).toBeVisible();
  await expect(page.getByLabel('创意描述')).toBeVisible();
  await expect(page.getByRole('button', { name: '提交创意' })).toBeVisible();
});

test('默认创意数据与搜索功能', async ({ page }) => {
  await page.goto('http://localhost:8080/');

  // 默认示例创意中的任意一个应可见
  await expect(page.getByText('新品发布会创意策划')).toBeVisible();

  // 搜索应根据标题过滤
  await page.getByPlaceholder(/请输入关键字/).fill('内部创意征集活动');
  await expect(page.getByText('内部创意征集活动')).toBeVisible();
  await expect(page.getByText('新品发布会创意策划')).not.toBeVisible();
});

test('创意表单校验与提交', async ({ page }) => {
  await page.goto('http://localhost:8080/');

  // 打开新增创意弹窗
  await page.getByRole('button', { name: '发表创意' }).click();

  // 直接提交应出现校验错误
  await page.getByRole('button', { name: '提交创意' }).click();
  await expect(page.getByText('请输入创意标题')).toBeVisible();
  await expect(page.getByText('请输入创意描述')).toBeVisible();

  // 填写合法数据并提交
  await page.getByLabel('创意标题').fill('测试创意标题');
  await page.getByLabel('创意描述').fill('这是一个测试创意的详细描述');
  await page.getByRole('button', { name: '提交创意' }).click();

  // 检查创意是否添加成功
  await expect(page.getByText('测试创意标题')).toBeVisible();
  await expect(page.getByText('这是一个测试创意的详细描述')).toBeVisible();
});

test('创意编辑流程', async ({ page }) => {
  await page.goto('http://localhost:8080/');

  // 新增一条待编辑创意
  await page.getByRole('button', { name: '发表创意' }).click();
  await page.getByLabel('创意标题').fill('待编辑的创意');
  await page.getByLabel('创意描述').fill('待编辑的创意描述');
  await page.getByRole('button', { name: '提交创意' }).click();

  const card = page.locator('.idea-card', { hasText: '待编辑的创意' });

  // 点击该卡片上的编辑按钮
  await card.getByRole('button', { name: '编辑' }).click();
  await expect(page.getByText('编辑创意')).toBeVisible();

  // 修改内容
  await page.getByLabel('创意标题').fill('已编辑的创意');
  await page.getByLabel('创意描述').fill('已编辑的创意描述');
  await page.getByRole('button', { name: '更新创意' }).click();

  // 检查更新后的内容（卡片标题 heading）
  await expect(
    page.getByRole('heading', { name: '已编辑的创意' }),
  ).toBeVisible();
  await expect(page.getByText('已编辑的创意描述')).toBeVisible();
});

test('创意删除需要二次确认', async ({ page }) => {
  await page.goto('http://localhost:8080/');

  // 新增一条待删除创意
  await page.getByRole('button', { name: '发表创意' }).click();
  await page.getByLabel('创意标题').fill('待删除的创意');
  await page.getByLabel('创意描述').fill('待删除的创意描述');
  await page.getByRole('button', { name: '提交创意' }).click();

  const card = page.locator('.idea-card', { hasText: '待删除的创意' });

  // 点击删除后应弹出确认弹窗
  await card.getByRole('button', { name: '删除' }).click();
  await expect(
    page.getByRole('heading', { name: '确认删除' }),
  ).toBeVisible();
  await expect(
    page.getByText('确定要删除「待删除的创意」这条创意吗？删除后将不可恢复。'),
  ).toBeVisible();

  // 点击确认删除
  await page.getByRole('button', { name: '确认删除' }).click();

  // 该创意不再可见
  await expect(page.getByText('待删除的创意')).not.toBeVisible();
});

test('头像点击显示轻气泡并自动消失', async ({ page }) => {
  await page.goto('http://localhost:8080/');

  // 点击头像显示提示
  await page.locator('.avatar-button').click();
  const tooltip = page.getByText('功能正在开发中');
  await expect(tooltip).toBeVisible();

  // 三秒后自动消失（加一些缓冲）
  await page.waitForTimeout(3500);
  await expect(tooltip).not.toBeVisible();
});
