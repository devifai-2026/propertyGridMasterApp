module.exports = {
  commands: [
    {
      name: 'run-web',
      description: 'Run the app on the web',
      func: () => {
        const { spawn } = require('child_process');
        console.log('Starting Web Server...');
        spawn('npx', ['webpack', 'serve', '--mode', 'development', '--config', 'webpack.config.js'], {
          stdio: 'inherit',
          shell: true,
        });
      },
    },
  ],
};
