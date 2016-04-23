/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope', function ($scope) {

	var me = this;

	//------VARIAVEIS DE VALIDACAO-----------

	$scope.colunaCheia = false;

	//---------------------------------------

	$scope.vencedor = "";

	//tabuleiro que recebe o jogador dominante de cada celula
	$scope.tabuleiro = [
		[{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""}],
		[{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""}],
		[{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""}],
		[{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""}],
		[{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""}],
		[{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""}],
		[{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""},{jogador: ""}]
	];

	//recebe quem esta jogando
	$scope.jogadorDaVez = null;


	//inicia o jogo
	$scope.iniciar = function(){

		//para zerar tabuleiro
		for(var coluna in $scope.tabuleiro){
			for(var linha in $scope.tabuleiro[coluna]){
				$scope.tabuleiro[coluna][linha].jogador = "";
			}
		}
		$scope.vencedor = "";

		$scope.jogadorDaVez = $scope.quemComeca;
	};

	//adiciona peca na coluna selecionada
	$scope.jogada = function(coluna){

		$scope.colunaCheia = false;

		for(var linha = $scope.tabuleiro[coluna].length-1; linha >= 0; linha--){
			if($scope.tabuleiro[coluna][linha].jogador == ""){
				
				$scope.tabuleiro[coluna][linha].jogador = angular.copy($scope.jogadorDaVez);

				me.verificaFimDeJogo($scope.tabuleiro, function(ret){

					console.log("ret verificaFimDeJogo", ret);

					if(ret == ""){
						me.alteraJogadorDaVez();	
					} else {
						$scope.vencedor = ret;
					}

				});

				//esse if so pode ser executado depois de verificaFimDeJogo
				
				

				return;
			}
		}

		$scope.colunaCheia = true;
	};

	//altera entre jogada humano e jogada computador
	me.alteraJogadorDaVez = function(){
		if($scope.jogadorDaVez == "humano"){
			$scope.jogadorDaVez = "computador";
			me.jogadaComputador();
		} else {
			$scope.jogadorDaVez = "humano";
		}
	};

	//calcula a proxima jogada do computador
	me.jogadaComputador = function(){

	};

	//da uma nota ao tabuleiro
	me.calcValorTabuleiro = function(){

	};

	//------------------------------------------VALIDADORES---------------------------------------------------

	//verifica se alguem ganhou
	me.verificaFimDeJogo = function(tabuleiro, callback){

		var possivelVencedor = {
			jogador: "",
			soma: 0
		};

		//verifica colunas
		for(var coluna in tabuleiro){
			possivelVencedor.jogador = "";
			possivelVencedor.soma = 0;

			for(var linha in tabuleiro[coluna]){

				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						return;
					}

				});

			}

		}


		//verifica linhas
		for(var linha = 0; linha <= 5; linha++ ){
			possivelVencedor.jogador = "";
			possivelVencedor.soma = 0;

			for (var coluna in tabuleiro) {
			
				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						return;
					}

				});

			}
		}

		//variaveis usadas nas verificacoes verticais
		var linha = null;
		var coluna = null;
		var colunaDejada = null;
		var linhaDesejada = null;

		//verifica verticais decrescentes
		linha = 2;
		coluna = 0;
		linhaDesejada = 5;
		colunaDejada = 3;

		while(linha != 4 && coluna != 7){
			possivelVencedor.jogador = "";
			possivelVencedor.soma = 0;

			while(linha <= linhaDesejada && coluna <= colunaDejada){

				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						return;
					}

				});

				coluna++;
				linha++;
			}

			if(linhaDesejada == 5 && colunaDejada == 3){
				linha = 1;
				coluna = 0;
				linhaDesejada = 5;
				colunaDejada = 4;
			} else if(linhaDesejada == 5 && colunaDejada == 4){
				linha = 0;
				coluna = 0;
				linhaDesejada = 5;
				colunaDejada = 5;
			} else if(linhaDesejada == 5 && colunaDejada == 5){
				linha = 0;
				coluna = 1;
				linhaDesejada = 5;
				colunaDejada = 6;
			} else if(linhaDesejada == 5 && colunaDejada == 6){
				linha = 0;
				coluna = 2;
				linhaDesejada = 4;
				colunaDejada = 6;
			} else if(linhaDesejada == 4 && colunaDejada == 6){
				linha = 0;
				coluna = 3;
				linhaDesejada = 3;
				colunaDejada = 6;
			}

		}

		//verifica verticais crescentes
		linha = 3;
		coluna = 0;
		linhaDesejada = 0;
		colunaDejada = 3;

		while(linha != 1 && coluna != 7){
			possivelVencedor.jogador = "";
			possivelVencedor.soma = 0;

			while(linha >= linhaDesejada && coluna <= colunaDejada){

				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						return;
					}

				});


				linha--;
				coluna++;
			}

			if(linhaDesejada == 0 && colunaDejada == 3){
				linha = 4;
				coluna = 0;
				linhaDesejada = 0;
				colunaDejada = 4;
			} else if(linhaDesejada == 0 && colunaDejada == 4){
				linha = 5;
				coluna = 0;
				linhaDesejada = 0;
				colunaDejada = 5;
			} else if(linhaDesejada == 0 && colunaDejada == 5){
				linha = 5;
				coluna = 1;
				linhaDesejada = 0;
				colunaDejada = 6;
			} else if(linhaDesejada == 0 && colunaDejada == 6){
				linha = 5;
				coluna = 2;
				linhaDesejada = 1;
				colunaDejada = 6;
			} else if(linhaDesejada == 1 && colunaDejada == 6){
				linha = 5;
				coluna = 3;
				linhaDesejada = 2;
				colunaDejada = 6;
			}
		}

		me.verificaEmpate(tabuleiro, function(ret){

			if(ret){
				callback("empate");
			} else {
				callback("");
			}

		});

	};

	//soma +1 em vencedor ou reseta calculo
	me.somaPontosVitoria = function(tabuleiro, coluna, linha, possivelVencedor, callback){

		if(tabuleiro[coluna][linha].jogador != ""){

			if(tabuleiro[coluna][linha].jogador != possivelVencedor.jogador){
				//quando sequencia nova
				possivelVencedor.jogador = angular.copy(tabuleiro[coluna][linha].jogador);
				possivelVencedor.soma = 1;
			} else {
				//quando na mesma sequencia
				possivelVencedor.soma ++;
			}

		} else {

			possivelVencedor.jogador = "";
			possivelVencedor.soma = 0;

		}

		callback(possivelVencedor);

	};

	me.verificaEmpate = function(tabuleiro, callback){

		for(var coluna in tabuleiro){

			if(tabuleiro[coluna][0].jogador == ""){
				callback(false);
				return;
			}
			
		}

		callback(true);

	};

	//---------------------------------------------------------------------------------------------

}]);