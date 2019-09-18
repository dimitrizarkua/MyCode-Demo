import 'nprogress/nprogress.css';
import * as nprogress from 'nprogress';

nprogress.configure({ showSpinner: false });

class NProgressTracker {
  counter = 0

  push() {
    if (this.counter === 0) {
      nprogress.start();
    }
    this.counter = this.counter + 1;
  }

  pop() {
    this.counter = this.counter - 1;
    if (this.counter < 0) {
      console.warn('Nprogress counter tries to get negative');
      this.counter = 0;
    }
    if (this.counter === 0) {
      nprogress.done();
    }
  }
}

export default new NProgressTracker();
