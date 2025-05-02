import { Router } from 'express';

const router = Router();

const langContent: Record<string, any> = {
  en: { title: 'Staff Login', username: 'Username', password: 'Password', submit: 'Login' },
  ar: { title: 'تسجيل دخول الموظف', username: 'اسم المستخدم', password: 'كلمة المرور', submit: 'دخول' },
  fr: { title: 'Connexion du personnel', username: 'Nom d\'utilisateur', password: 'Mot de passe', submit: 'Connexion' },
  cn: { title: '员工登录', username: '用户名', password: '密码', submit: '登录' },
};

router.get('/', (req, res) => {
  const lang = req.body.lang as string || 'en';
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
      <h1>${content.title}</h1>
      <a href="/staff/login" class="btn btn-primary mt-4">${content.submit}</a>
    </body>
    </html>
  `);
});

router.get('/login', (req, res) => {
  const lang = req.body.lang as string || 'en';
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
    <body class="container py-5">
      <h2 class="text-center mb-4">${content.title}</h2>
      <form action="/staff/login" method="post" class="mx-auto" style="max-width:400px;">
        <div class="mb-3">
          <label for="username" class="form-label">${content.username}</label>
          <input type="text" id="username" name="username" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">${content.password}</label>
          <input type="password" id="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">${content.submit}</button>
      </form>
    </body>
    </html>
  `);
});

export default router;
