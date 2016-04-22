/**
 * Created by Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope', function ($scope) {

	var me = this;

	//------VARIAVEIS DE VALIDACAO-----------

	$scope.colunaCheia = false;

	//---------------------------------------

	$scope.vencedor = {
		soma: 0,
		jogador: ''
	};

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
		$scope.vencedor.jogador = "";

		$scope.jogadorDaVez = $scope.quemComeca;
	};

	//adiciona peca na coluna selecionada
	$scope.jogada = function(coluna){

		$scope.colunaCheia = false;

		for(var linha = $scope.tabuleiro[coluna].length-1; linha >= 0; linha--){
			if($scope.tabuleiro[coluna][linha].jogador == ""){
				
				$scope.tabuleiro[coluna][linha].jogador = angular.copy($scope.jogadorDaVez);

				me.verificaFimDeJogo();

				//esse if so pode ser executado depois de verificaFimDeJogo
				if($scope.vencedor.soma < 4){
					me.alteraJogadorDaVez();	
				};
				

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
	me.verificaFimDeJogo = function(){

		//verifica colunas
		for(var coluna in $scope.tabuleiro){
			$scope.vencedor.jogador = "";
			$scope.vencedor.soma = 0;

			for(var linha in $scope.tabuleiro[coluna]){

				me.somaPontosVitoria(coluna, linha);
				if($scope.vencedor.soma >= 4){
					return;
				}

			}

		}

		//verifica linhas
		for(var linha = 0; linha <= 5; linha++ ){
			$scope.vencedor.jogador = "";
			$scope.vencedor.soma = 0;

			for (var coluna in $scope.tabuleiro) {
			
				me.somaPontosVitoria(coluna, linha);
				if($scope.vencedor.soma >= 4){
					return;
				}

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
			$scope.vencedor.jogador = "";
			$scope.vencedor.soma = 0;

			while(linha <= linhaDesejada && coluna <= colunaDejada){

				me.somaPontosVitoria(coluna, linha);
				if($scope.vencedor.soma >= 4){
					return;
				}

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
			$scope.vencedor.jogador = "";
			$scope.vencedor.soma = 0;

			while(linha >= linhaDesejada && coluna <= colunaDejada){

				me.somaPontosVitoria(coluna, linha);
				if($scope.vencedor.soma >= 4){
					return;
				}


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
	};

	//soma +1 em vencedor ou reseta calculo
	me.somaPontosVitoria = function(coluna, linha){

		if($scope.tabuleiro[coluna][linha].jogador != ""){

			if($scope.tabuleiro[coluna][linha].jogador != $scope.vencedor.jogador){
				//quando sequencia nova
				$scope.vencedor.jogador = angular.copy($scope.tabuleiro[coluna][linha].jogador);
				$scope.vencedor.soma = 1;
			} else {
				//quando na mesma sequencia
				$scope.vencedor.soma ++;
			}

		}

	};

	//---------------------------------------------------------------------------------------------

}]);