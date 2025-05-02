import { Router } from 'express';

const router = Router();

const langContent: Record<string, any> = {
  en: { title: 'User Services', welcome: 'Welcome to User Services', explore: 'Explore Services' },
  ar: { title: 'خدمات المستخدم', welcome: 'مرحبًا بك في خدمات المستخدم', explore: 'استكشف الخدمات' },
  fr: { title: 'Services aux utilisateurs', welcome: 'Bienvenue dans les services utilisateurs', explore: 'Explorer les services' },
  cn: { title: '用户服务', welcome: '欢迎来到用户服务', explore: '探索服务' },
};

router.get('/', (req, res) => {
  const lang = (req.cookies?.lang as string) || 'en';
  const content = langContent[lang] || langContent.en;

  res.send(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.title}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="d-flex flex-column justify-content-center align-items-center" style="height:100vh;">
      <h1>${content.welcome}</h1>
      <a href="/client/services" class="btn btn-success mt-4">${content.explore}</a>
    </body>
    </html>
  `);
});

router.get('/services', (req, res) => {
  const lang = (req.cookies?.lang as string) || 'en';
  const content = langContent[lang] || langContent.en;

  res.send(`
    <!DOCTYPE html>
    <html lang="${lang}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${content.explore}</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container py-5">
      <h2 class="text-center mb-4">${content.explore}</h2>
      <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action">Service 1</a>
        <a href="#" class="list-group-item list-group-item-action">Service 2</a>
        <a href="#" class="list-group-item list-group-item-action">Service 3</a>
      </div>
    </body>
    </html>
  `);
});

export default router;
