/**
 * Created by Gustavo & Osvaldo on 23/09/15.
 */

app.controller("homeController",['$scope', function ($scope) {

	var me = this;

	//----------COMANDOS DO TECLADO----------
	$(document).keyup(function(event){
		if($scope.jogadorDaVez == 'computador' || $scope.vencedor != null || $scope.jogadorDaVez === null){
			console.log("ops, n posso jogar agora!");
		} else {

			var tecla = null;

			for(var btn = 0; btn <= 6; btn++){
				if(event.keyCode == 49+btn){

					$scope.jogadaHumano(btn);

					me.reiniciaScopeApply();

					return;
				}
			}

		}
	});
	//---------------------------------------

	//------VARIAVEIS DE VALIDACAO-----------

	$scope.colunaCheia = false;

	//---------------------------------------
	//mostra na interface o valor dado ao tabuleiro pela heuristica
	$scope.valorDoTabuleiroAtual = null;

	//guarda o vencedor
	$scope.vencedor = null;

	//tabuleiro que recebe o jogador dominante de cada celula
	$scope.tabuleiro = [
		[null,null,null,null,null,null],
		[null,null,null,null,null,null],
		[null,null,null,null,null,null],
		[null,null,null,null,null,null],
		[null,null,null,null,null,null],
		[null,null,null,null,null,null],
		[null,null,null,null,null,null]
	];

	//recebe quem esta jogando
	$scope.jogadorDaVez = null;

	//guarda a ordem de pesquisa minmax
	me.ordemColuna = [3,4,2,5,1,6,0];

	//guarda o número de iteracao
	$scope.mostraIteracao = null;

	me.reiniciaScopeApply = function(){
		var phase = $scope.$root.$$phase;
		if(phase == '$apply' || phase == '$digest'){
		   $scope.$eval();
		}else{
		   $scope.$apply();
		}
	};

	//inicia o jogo
	$scope.iniciar = function(){

		if($scope.quemComeca == undefined){
			return;
		}

		//para zerar tabuleiro
		for(var coluna in $scope.tabuleiro){
			for(var linha in $scope.tabuleiro[coluna]){
				$scope.tabuleiro[coluna][linha] = null;
			}
		}
		$scope.vencedor = null;

		$scope.jogadorDaVez = angular.copy($scope.quemComeca);
		if($scope.quemComeca == "computador"){
			me.jogadaComputador();
		}
	};

	//adiciona peca na coluna selecionada
	me.jogada = function(tabuleiro, coluna, jogadordavez, callback){

		for(var linha = tabuleiro[coluna].length-1; linha >= 0; linha--){
			if(tabuleiro[coluna][linha] == null){
				
				tabuleiro[coluna][linha] = angular.copy(jogadordavez);

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

		} else {
			$scope.jogadorDaVez = "humano";
		}
	};

	//executa a jogada do humano
	$scope.jogadaHumano = function(coluna){

		$scope.colunaCheia = false;

		me.jogada(angular.copy($scope.tabuleiro), coluna, 1, function(retTabuleiro){

			if(retTabuleiro == "colunaEstaCheia"){
				
				$scope.colunaCheia = true;

			} else {

				$scope.tabuleiro = angular.copy(retTabuleiro);

				me.verificaFimDeJogo(retTabuleiro, function(retVencedor){

					$scope.mostraValorTabuleiro();

					if(retVencedor == null){
						me.alteraJogadorDaVez();	
					} else {
						$scope.vencedor = angular.copy(retVencedor);
					}

				});

			}

		});

		setTimeout(function(){
			console.log("vou comecar comp");
			me.jogadaComputador();
		}, 1000);
		

	};

	me.jogadaComputador = function(){

		$scope.mostraIteracao = 0;

		me.calcMinMax(-Infinity, Infinity, 0, [null, null, null, null, null, null, null], 1, angular.copy($scope.tabuleiro), function(retDecisao){

			console.log("retDecisao", retDecisao);
					
			me.jogada(angular.copy($scope.tabuleiro), retDecisao.coluna, 0, function(retTabuleiro){

				$scope.tabuleiro = angular.copy(retTabuleiro);

				me.verificaFimDeJogo(angular.copy(retTabuleiro), function(retVencedor){

					$scope.mostraValorTabuleiro();

					if(retVencedor == null){
						me.alteraJogadorDaVez();	
					} else {
						$scope.vencedor = angular.copy(retVencedor);
					}

					me.reiniciaScopeApply();

				});
			});

		});
	};

	//calcula a proxima jogada do computador
	me.calcMinMax = function(alfa, beta, davez, filhos, nivel, tabuleiro, callback){

		$scope.mostraIteracao++;

		// percorre as 7 colunas
		for(var index in me.ordemColuna){

			//corta nodo
			if(alfa > beta){
				break;
			}

			verificaNodo(me.ordemColuna[index], nivel, function(retNodo){

				filhos[me.ordemColuna[index]] = retNodo;

				//atualiza alfa/beta
				if(retNodo != undefined){
					if(davez){
						//MIN
						if(beta > retNodo.pontuacao){
							beta = retNodo.pontuacao;
						}
					} else {
						//MAX
						if(alfa < retNodo.pontuacao){
							alfa = retNodo.pontuacao;
						}
					}
				}

			});
		}

		if(nivel == 1){
			console.log("filhos",filhos);
		}
		me.escolheMelhorNodo(davez, filhos, function(retMelhorAtual){
			callback(retMelhorAtual);
		});

		function verificaNodo(coluna, qualNivel, callbackNodo){

			me.jogada(angular.copy(tabuleiro), coluna, davez, function(retTabuleiro){

				if(retTabuleiro == "colunaEstaCheia"){
					//verifica se jogada possivel
					callbackNodo();
					return;

				} else {
					//verifica se nodo final/folha

					me.verificaFimDeJogo(retTabuleiro, function(retVencedor){
						
						if(retVencedor == "empate"){
							callbackNodo({pontuacao: 0, coluna: coluna});
							return;
						} else if(qualNivel >= 6 || retVencedor == 1 || retVencedor == 0){

							me.calcValorTabuleiro(retTabuleiro, function(retPontuacao){
								callbackNodo({pontuacao: retPontuacao, coluna: coluna});
							});

						} else {
							//se !nodo folha/final volta loop
							me.calcMinMax(angular.copy(alfa), angular.copy(beta), !davez, [null, null, null, null, null, null, null], qualNivel+1, retTabuleiro, function(retMelhorNodo){
								callbackNodo(retMelhorNodo);
							});

						}

					});

				}

			});
		}

	};

	//escolhe melhor posibilidade
	me.escolheMelhorNodo = function(davez, filhos, callback){

		var maiorNodo = {pontuacao: -Infinity};
		var menorNodo = {pontuacao: Infinity};

		for(var nodo in filhos){
			if(filhos[nodo] != undefined){
				if(maiorNodo.pontuacao < filhos[nodo].pontuacao){
					maiorNodo = {
						pontuacao: filhos[nodo].pontuacao,
						coluna: nodo
					};
				}

				if(menorNodo.pontuacao > filhos[nodo].pontuacao){
					menorNodo = {
						pontuacao: filhos[nodo].pontuacao,
						coluna: nodo
					};
				}
			}
		}
		if(davez){
			//quero menor
			callback(menorNodo);
			return;
		} else {
			//quero maior
			callback(maiorNodo);
			return;
		}
	};

	//mostra o valor atual do tabuleiro atravez do console
	$scope.mostraValorTabuleiro = function(){
		me.calcValorTabuleiro(angular.copy($scope.tabuleiro), function(ret){
			$scope.valorDoTabuleiroAtual = angular.copy(ret);
		});
	};

	//da uma nota ao tabuleiro
	me.calcValorTabuleiro = function(tabuleiro, callback){

		var somaTabuleiro = 0;
		var temQuadrupla = false;
		var nivel = 0;

		for(var coluna = 0; coluna <= 6; coluna++){
			for(var linha = 0; linha <= 5; linha++){
				me.calcPossiveisJogadas(tabuleiro, coluna, linha, temQuadrupla, function(ret){

					somaTabuleiro += ret.somaAtual;
					temQuadrupla = ret.temQuadrupla;

					if(tabuleiro[coluna][linha] != undefined){
						nivel++;
					}

				});
			}
		}

		callback(somaTabuleiro * (1-(nivel/100)));

	};

	//calcula as possiveis jogadas a partir da posicao e tabuleiro enviados
	me.calcPossiveisJogadas = function(tabuleiro, coluna, linha, temQuadrupla, callback){

		//da um valor as possiveis sequencias
		var somaAtual = 0;

		//guarda quantas pecas existem por sequencia
		var sequenciaAtual = [
			{
				jogador: null,
				soma: 0
			},
			{
				jogador: null,
				soma: 0
			},
			{
				jogador: null,
				soma: 0
			},
			{
				jogador: null,
				soma: 0
			}
		];

		function somaJogada(jogada, x, y, callback){

			if(x > 6 ||y > 5 || y < 0){

				jogada.jogador = null;
				jogada.soma = 0;

				callback("break");

				return;

			} else {
				if(tabuleiro[x][y] != null){
					if(jogada.jogador == null){
						jogada.jogador = tabuleiro[x][y];
						jogada.soma = 1;
					} else if(jogada.jogador == tabuleiro[x][y]) {
						jogada.soma ++;
					} else {
						jogada.jogador = null;
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
				pontos = 500;
			} else if(sequenciaAtual[index].soma == 4 && !temQuadrupla){
				temQuadrupla = true;
				pontos = 20000;
			}

			if(sequenciaAtual[index].jogador == 1){
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

		var callReturn = false;

		var possivelVencedor = {
			jogador: null,
			soma: 0
		};

		//verifica colunas
		for(var coluna in tabuleiro){

			possivelVencedor.jogador = null;
			possivelVencedor.soma = 0;

			for(var linha in tabuleiro[coluna]){

				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						callReturn = true;
					}

				});

			}

		}


		//verifica linhas
		for(var linha = 0; linha <= 5; linha++ ){

			possivelVencedor.jogador = null;
			possivelVencedor.soma = 0;

			for (var coluna in tabuleiro) {
			
				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						callReturn = true;
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

			possivelVencedor.jogador = null;
			possivelVencedor.soma = 0;

			while(linha <= linhaDesejada && coluna <= colunaDejada){

				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						callReturn = true;
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

			possivelVencedor.jogador = null;
			possivelVencedor.soma = 0;

			while(linha >= linhaDesejada && coluna <= colunaDejada){

				me.somaPontosVitoria(tabuleiro, coluna, linha, possivelVencedor, function(ret){

					possivelVencedor = ret;

					if(possivelVencedor.soma >= 4){
						callback(possivelVencedor.jogador);
						callReturn = true;
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

		if(callReturn){

			return;

		} else {

			me.verificaEmpate(tabuleiro, function(ret){

				if(ret){
					callback("empate");
				} else {
					callback(null);
				}

			});

		}

	};

	//soma +1 em vencedor ou reseta calculo
	me.somaPontosVitoria = function(tabuleiro, coluna, linha, possivelVencedor, callback){

		if(tabuleiro[coluna][linha] != null){

			if(tabuleiro[coluna][linha] != possivelVencedor.jogador){
				//quando sequencia nova
				possivelVencedor.jogador = angular.copy(tabuleiro[coluna][linha]);
				possivelVencedor.soma = 1;
			} else {
				//quando na mesma sequencia
				possivelVencedor.soma ++;
			}

		} else {

			possivelVencedor.jogador = null;
			possivelVencedor.soma = 0;

		}

		callback(possivelVencedor);

	};

	me.verificaEmpate = function(tabuleiro, callback){

		for(var coluna in tabuleiro){

			if(tabuleiro[coluna][0] == null){
				callback(false);
				return;
			}
			
		}

		callback(true);

	};

	//---------------------------------------------------------------------------------------------

}]);