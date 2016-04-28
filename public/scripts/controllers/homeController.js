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
	me.jogada = function(tabuleiro, coluna, jogadordavez, callback){

		for(var linha = tabuleiro[coluna].length-1; linha >= 0; linha--){
			if(tabuleiro[coluna][linha].jogador == ""){
				
				tabuleiro[coluna][linha].jogador = angular.copy(jogadordavez);

				callback(tabuleiro);

				return;

			}
		}

		callback("colunaEstaCheia");

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

	//executa a jogada do humano
	$scope.jogadaHumano = function(coluna){

		$scope.colunaCheia = false;

		me.jogada(angular.copy($scope.tabuleiro), coluna, angular.copy($scope.jogadorDaVez), function(retTabuleiro){

			if(retTabuleiro == "colunaEstaCheia"){
				
				$scope.colunaCheia = true;

			} else {

				$scope.tabuleiro = retTabuleiro;

				me.verificaFimDeJogo(retTabuleiro, function(retVencedor){

					console.log("ret verificaFimDeJogo", retVencedor);

					if(retVencedor == ""){
						me.alteraJogadorDaVez();	
					} else {
						$scope.vencedor = retVencedor;
					}

				});

			}

		});
	};

	//calcula a proxima jogada do computador
	me.jogadaComputador = function(){

	};

	$scope.teste = function(){
		me.calcValorTabuleiro($scope.tabuleiro, function(ret){
			console.log("valor do tabuleiro", ret);
		});
	};

	//da uma nota ao tabuleiro
	me.calcValorTabuleiro = function(tabuleiro, callback){

		var somaTabuleiro = 0;
		var temQuadrupla = false;

		for(var coluna = 0; coluna <= 6; coluna++){
			for(var linha = 0; linha <= 5; linha++){
				me.calcPossiveisJogadas(tabuleiro, coluna, linha, temQuadrupla, function(ret){

					somaTabuleiro += ret.somaAtual;
					temQuadrupla = ret.temQuadrupla;

				});
			}
		}

		callback(somaTabuleiro);

	};

	//calcula as possiveis jogadas a partir da posicao e tabuleiro enviados
	me.calcPossiveisJogadas = function(tabuleiro, coluna, linha, temQuadrupla, callback){

		//da um valor as possiveis sequencias
		var somaAtual = 0;

		//quarda quantas pecas existem por sequencia
		var sequenciaAtual = [
			{
				jogador: "",
				soma: 0
			},
			{
				jogador: "",
				soma: 0
			},
			{
				jogador: "",
				soma: 0
			},
			{
				jogador: "",
				soma: 0
			}
		];

		function somaJogada(jogada, x, y, callback){

			if(x > 6 || y > 5 || y < 0){

				jogada.jogador = "";
				jogada.soma = 0;

				callback("break");

				return;

			} else {
				if(tabuleiro[x][y].jogador != ""){
					if(jogada.jogador == ""){
						jogada.jogador = tabuleiro[x][y].jogador;
						jogada.soma = 1;
					} else if(jogada.jogador == tabuleiro[x][y].jogador) {
						jogada.soma ++;
					} else {
						jogada.jogador = "";
						jogada.soma = 0;

						callback("break");

						return;

					}
				}
			}

		}

		//verifica sequencia para direita
		for(var colunaAtual = coluna; colunaAtual < coluna+4; colunaAtual++){

			var quebra = false;

			somaJogada(sequenciaAtual[0], colunaAtual, linha, function(ret){

				if(ret == "break"){
					quebra = true;
				}

			});

			if(quebra){
				break;
			}
		}

		//verifica sequencia para baixo
		for(var linhaAtual = linha; linhaAtual < linha+4; linhaAtual++){

			var quebra = false;

			somaJogada(sequenciaAtual[1], coluna, linhaAtual, function(ret){

				if(ret == "break"){
					quebra = true;
				}

			});

			if(quebra){
				break;
			}
		}

		//verifica sequencia para diagonal decrescente
		var colunaAtual = coluna;
		var linhaAtual = linha;
		while(colunaAtual < coluna+4){

			var quebra = false;

			somaJogada(sequenciaAtual[2], colunaAtual, linhaAtual, function(ret){

				if(ret == "break"){
					quebra = true;
				}

			});

			if(quebra){
				break;
			}

			colunaAtual++;
			linhaAtual++;
		}

		//verifica sequencia para diagonal crescente
		colunaAtual = coluna;
		linhaAtual = linha;
		while(colunaAtual < coluna+4){

			var quebra = false;

			somaJogada(sequenciaAtual[3], colunaAtual, linhaAtual, function(ret){

				if(ret == "break"){
					quebra = true;
				}

			});

			if(quebra){
				break;
			}

			colunaAtual ++;
			linhaAtual --;
		}


		//faz o somatorio final
		for(var index in sequenciaAtual){

			var pontos = 0;

			if(sequenciaAtual[index].soma == 1){
				pontos = 5;
			} else if(sequenciaAtual[index].soma == 2){
				pontos = 50;
			} else if(sequenciaAtual[index].soma == 3){
				pontos = 100;
			} else if(sequenciaAtual[index].soma == 4 && !temQuadrupla){
				temQuadrupla = true;
				pontos = 10000;
			}

			if(sequenciaAtual[index].jogador == "humano"){
				somaAtual -= pontos;
			}else{
				somaAtual += pontos;
			}

		}

		ret = {
			somaAtual: somaAtual,
			temQuadrupla: temQuadrupla
		};

		callback(ret);

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