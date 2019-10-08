import { app } from './app';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(
    ' App is running at http://localhost:%d in %s mode',
    port,
    app.get('env'),
  );
  console.log(' Press CTRL-C to stop\n');
});