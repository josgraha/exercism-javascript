const stackify = str => (typeof str === 'string' ? str.split(/s+/) : [];

class Forth {
  constructor() {
    this.stack = [];
  }
  
  evaluate(code) {
    this.stack = stackify(str);
  }
   
    
}

export default Forth;
