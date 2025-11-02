const { spawn } = require('child_process');

// Script para executar ou nao as migrations ao iniciar a aplicacao

const MIGRATIONS = String(process.env.MIGRATIONS || '').toLowerCase() === 'true';

function run(cmd, args = [], opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

(async () => {
  try {
    if (MIGRATIONS) {
      console.log('[bootstrap] MIGRATIONS=true -> executando "migrate-mongo up"...');
      await run('npx', ['migrate-mongo', 'up']);
      console.log('[bootstrap] Migrations concluídas.');
    } else {
      console.log('[bootstrap] MIGRATIONS=false -> pulando migrations.');
    }

    console.log('[bootstrap] Iniciando a aplicação...');
   
    await run('npm', ['run', 'start:app']);
  } catch (err) {
    console.error('[bootstrap] Falha no bootstrap:', err.message);
    process.exit(1);
  }
})();
