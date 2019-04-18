function Mensagem() {
  
  this.mensagem = 'Passou';
  
  // Traditional function
  this.loggar = function() {
    return this.mensagem;        
  };
}

const msg = new Mensagem(); 
console.log(msg.loggar()); // undefined
