var botaoBuscar = document.querySelector("#buscar-cep"); //seleciona elemento botão Buscar CEP


botaoBuscar.addEventListener("click", function(event){  //escutando o evento (click) no botão buscar
	//requisição em uma urla para ir buscar os dados no endereço
	event.preventDefault();
	var campoCep = document.querySelector("#cep"); // seleciona o elemento de input do númeor do cep
	var numCep = campoCep.value; // grava na variável o o valor do input que é o número do cep digitado, pois vai precisar para montar o link de consulta: ex. https://viacep.com.br/ws/70675725/json/

	var xhr = new XMLHttpRequest(); // XMLHttpRequest = objeto do js para fazer requisição HTTP assíncronas,transporta xml e outros tipos de dados, mas precisar configurar com alguns funções;
	xhr.open("GET", "https://viacep.com.br/ws/"+numCep+"/json/"); // abre a conexao do tipo get para o endereço heroku.. (servidor)

	xhr.addEventListener("load", function(){  // escutar se a resposta já foi carregada
		//antes de tratar a requisição, colocou o if para depois que carregou a requisição vazer verificação de erros
		var erroAjax = document.querySelector("#erro-ajax"); // cria a var e seta o elemento <span> para futuramente receber msg de erro
		console.log(xhr.status);
		if(xhr.status == 200) { // Esse IF verifica o status da requisição, se o endereço está disponível, ==200 é quando OK. Ainda não confere a validade do CEP
			erroAjax.classList.add("invisivel"); // como status da requisição esta OK, então add class invisivel para a msg de erro <spam>
			var resposta = xhr.responseText; //texto de resposta da requisição
			var dadosCep = JSON.parse(resposta);// transformar o JSON em objeto java scritp, nesse caso em um objeto array
			if (dadosCep.erro == true) {   // esse IF é para verificar se a reposta do site é um cep válido ou inválido. se inválido o site retorna: {"erro": true}
				console.log("o site está respondendo mas o CEP é inválido. Dá a responta {'erro': true}");
				erroAjax.classList.remove("invisivel");

			} else { // senão, é porque CEP é VALIDO, ENTÃO chama a função pra exibir os dados
				exibeDadosCep(dadosCep);
			}
		} else {
			console.log(xhr.status); //mostra o número do status, nesse caso de erro
			console.log(xhr.responseText);// resposta do erro
			console.log("Não conseguimos fazer conexao com o site. Não dependo no número do CEP");
			erroAjax.classList.remove("invisivel"); // remove a classe invisível da tag <spam> pra mostrar msg de erro.
		}
	});
	xhr.send();// função para envivar requisição da conexao que foi criada	
});

//__________________________________----------------- Funções--------------------______________________________________

		// monta na tabela os dados do CEP
function exibeDadosCep(dadosCep){   // para o cep, add na tabela, aproveita a função do formulário add
	var cepTr = montaTr(dadosCep); // pega o TR criado e seus TDs e atribui ao objeto cepTr
		/* seleciona a tabela (query) e coloca o Tr (filhos (tds) dentro da tabela (tbody = #tabela-cep)*/
	var tabela = document.querySelector("#tabela-cep");
	tabela.appendChild(cepTr);/*vincula a filha TR no pai Tabela*/
	console.log(typeof dadosCep)
};

		/*função que:  cria a Tr e Tds,  seta nas tds o valor dos inputs do formulário;	vincula as tds na tr*/
function montaTr(dadosCep) {
		/* criar element 'tr' usa a função .createElement()*/
	var trCep = document.createElement("tr"); /*vincula o td a classe original da tabela*/
	trCep.classList.add("cep", "alert", "alert-success"); /*vincula/atribui as classes CEP e SUCCESS para a Tr criada, a de success é do bootstrap pra cor*/

		/* Uma função dentro da outra pra economizar código:
		1º função interna (montaTd): criar a td; pegar o texto do input do form e seta na td criada; vincula a td respectiva classe da tabela;
		2º função appendChild: colocar os elementos td criados pela montaTd(), filhos, dentro do tr (pai): trCep  */
	trCep.appendChild(montaTd(dadosCep.cep, "info-cep")); /*o dadosCep.cep é a propriedade CEP do objeto dadosCep obtido do JSON..   o "info-nome" é a classe do Td na tabela*/
	trCep.appendChild(montaTd(dadosCep.logradouro, "info-logradouro"));
	trCep.appendChild(montaTd(dadosCep.complemento, "info-complemento"));
	trCep.appendChild(montaTd(dadosCep.bairro, "info-bairro"));
	trCep.appendChild(montaTd(dadosCep.localidade, "info-localidade"));
	trCep.appendChild(montaTd(dadosCep.uf, "info-uf"));
	trCep.appendChild(montaTd(dadosCep.unidade, "info-unidade"));
	trCep.appendChild(montaTd(dadosCep.ibge, "info-ibge"));
	trCep.appendChild(montaTd(dadosCep.gia, "info-gia"));

	return trCep;
}

function montaTd(dado, classe) {
	var td = document.createElement("td"); /* cria td usando createElement("..")*/
	td.textContent = dado;   /* pegar os valores do input (armazezados no objeto cep, trazido pela função obtemcep...) 
								e coloca (seta) como conteudo das 'td's criadas*/
	td.classList.add(classe); /*vincula o td a classe original da tabela*/
	return td
}

/*
------ Tratando a resposta da requisição------------------
técnica de fazer requisções assincrona usando JS, ou seja, sem travar o navegador


JSON (java script objeto notetion) = transpostar objetos js pela WEB em 

var resposta = xhr.responseText;
console.log(typeof resposta); // texto STRING em JSON

var dadosCep = JSON.parse(resposta);
console.log(typeof dadosCep) // objeto array de js

*/