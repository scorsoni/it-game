# 🎈 IT - O Pesadelo dos Balões

Um jogo inspirado no filme de terror **IT - A Coisa**, onde você deve estourar os balões vermelhos de Pennywise sem clicar nos barquinhos de papel!

![IT Game](https://img.shields.io/badge/Status-Completo-success)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)
![Mobile](https://img.shields.io/badge/Mobile-Suportado-blue)

## 🎮 Sobre o Jogo

Entre no universo aterrorizante de IT e teste seus reflexos neste jogo de ação e precisão! Balões vermelhos sobem pela tela e você precisa estourá-los clicando sobre eles. Mas cuidado: não clique nos barquinhos de papel ou você perderá pontos!

### ✨ Recursos

- 🎨 Visual temático sombrio inspirado no filme IT
- 🎵 Áudio de fundo com a risada sinistra de Pennywise em loop
- 📱 Totalmente responsivo e otimizado para dispositivos móveis
- 🎯 Sistema de pontuação e níveis progressivos
- ❤️ Sistema de vidas (3 vidas)
- 👻 Easter eggs assustadores durante o jogo
- 🎨 Efeitos visuais de sangue e animações

## 🕹️ Como Jogar

1. **Objetivo**: Estoure o máximo de balões vermelhos possível sem deixá-los escapar
2. **Controles**:
   - 🖱️ **Desktop**: Clique nos balões com o mouse
   - 📱 **Mobile**: Toque nos balões na tela
3. **Regras**:
   - ✅ Clique nos **balões vermelhos** para ganhar pontos
   - ❌ **NÃO clique** nos barquinhos de papel (perde 5 pontos)
   - ⚠️ Se um balão escapar pela parte superior, você perde uma vida
   - 📈 A cada 10 pontos, o nível aumenta e os balões ficam mais rápidos
   - 💀 Você tem 3 vidas - use-as com sabedoria!

## 🎯 Sistema de Pontuação

- **+1 ponto**: Por cada balão estourado
- **-5 pontos**: Por cada barquinho de papel clicado
- **-1 vida**: Por cada balão que escapa pela tela
- **Nível aumenta**: A cada 10 pontos

## 🚀 Como Executar

### Pré-requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (ou simplesmente abrir o arquivo HTML)

### Instalação

1. Clone ou baixe este repositório:
```bash
git clone <url-do-repositorio>
cd it-game
```

2. Abra o arquivo `index.html` diretamente no navegador ou use um servidor local:

**Opção 1**: Abrir diretamente
```bash
# Simplesmente abra o arquivo index.html no navegador
```

**Opção 2**: Servidor Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Opção 3**: Servidor PHP
```bash
php -S localhost:8000
```

**Opção 4**: Live Server (VS Code)
```
Instale a extensão "Live Server" e clique com botão direito no index.html > "Open with Live Server"
```

3. Acesse o jogo em `http://localhost:8000`

## 📁 Estrutura do Projeto

```
it-game/
│
├── index.html              # Página principal do jogo
├── assets/
│   ├── css/
│   │   └── app.css        # Estilos do jogo
│   ├── js/
│   │   └── app.js         # Lógica do jogo
│   ├── audio/
│   │   └── laugh.mp3      # Áudio de fundo (risada do Pennywise)
│   └── images/
│       └── barco.png      # Imagem do barquinho de papel
│
└── README.md              # Este arquivo
```

## 🎨 Características Técnicas

### Tecnologias Utilizadas

- **HTML5 Canvas**: Para renderização gráfica do jogo
- **JavaScript Vanilla**: Lógica do jogo sem frameworks
- **CSS3**: Animações e estilização temática
- **Web Audio API**: Efeitos sonoros procedurais
- **HTML5 Audio**: Reprodução do áudio de fundo

### Funcionalidades Implementadas

- ✅ Sistema de física para movimento dos balões
- ✅ Detecção de colisão precisa
- ✅ Animações de partículas (efeito de sangue)
- ✅ Sistema de easter eggs aleatórios
- ✅ Responsividade para diferentes tamanhos de tela
- ✅ Suporte a eventos touch para mobile
- ✅ Áudio de fundo em loop infinito
- ✅ Redimensionamento dinâmico do canvas

## 📱 Compatibilidade Mobile

O jogo foi otimizado para funcionar perfeitamente em dispositivos móveis:

- ✅ Eventos de toque (touchstart)
- ✅ Canvas responsivo
- ✅ Interface adaptativa
- ✅ Prevenção de zoom indesejado
- ✅ Área de toque aumentada para melhor jogabilidade
- ✅ Suporte a mudança de orientação

## 🎭 Easter Eggs

Durante o jogo, você pode encontrar eventos especiais assustadores:

- 👀 Olhos vermelhos brilhantes aparecem na tela
- 💬 Mensagens sinistras do Pennywise
- ⚡ Flashes vermelhos na tela
- 🎵 Risada sinistra constante em loop

## 🐛 Bugs Conhecidos

Atualmente não há bugs conhecidos. Se encontrar algum, por favor reporte!

## 🔮 Melhorias Futuras

- [ ] Adicionar diferentes tipos de balões com pontuações variadas
- [ ] Sistema de power-ups
- [ ] Ranking de pontuações (localStorage)
- [ ] Mais easter eggs e efeitos especiais
- [ ] Sons diferentes para cada ação
- [ ] Modo de dificuldade selecionável

## 👨‍💻 Desenvolvimento

### Como Contribuir

1. Fork este repositório
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é um projeto educacional e de entretenimento inspirado no universo de IT.

## 🎬 Créditos

- Inspirado no filme **IT - A Coisa** (Stephen King)
- Fontes: Google Fonts (Creepster, Nosifer)
- Desenvolvido com ❤️ e um pouco de terror

---

**Aviso**: Este jogo contém elementos de terror leve. Não recomendado para crianças muito pequenas.

🎈 *"Você também flutua aqui embaixo..."* 🎈
