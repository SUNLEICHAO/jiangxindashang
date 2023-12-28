const PAGE = {
  data: {
    msg: [
      {
        name: '蓝色西瓜',
        text: '祝福~'
      },
      {
        name: '可怕的大狗熊',
        text: '感谢老师的辛勤付出和耐心教导，祝您身体健康，工作顺利！'
      },
      {
        name: '大神小石头​',
        text: '愿未来的日子里，我们都能勇敢地追求自己的梦想，坚定地走自己的路，过上更加美好的生活！~'
      },
      {
        name: '清水束竹​​',
        text: '感谢老师对我的关心和帮助，让我在学习的道路上更加坚定和自信！'
      },
      {
        name: '啥都不明白​',
        text: '愿我们在未来的日子里，能够实现自己的梦想和目标，过上自己想要的生活！'
      },
    ],
    backgroundColors: [
      '#EAC435',
      '#faf0d5',
      '#d8dad9',
      '#c0ddfc',
      '#f7c4e2',
    ],
    item: null,
    itemWidth: 320,
    itemHeight: 160,
    pageX: null,
    pageY: null,
    offsetLeft: 0,
    offsetTop: 0,
    isLocked: true,
    zIndex: 0,
  },
  init: function () {
    this.bind();
  },
  bind: function () {
    let msgSubmit = document.getElementsByClassName('wish-input__btn')[0]
    msgSubmit.addEventListener('click', this.handleSubmit)

    // 将数据中的留言添加进去
    this.addMsgs()
    // 在板子上按下鼠标
    // 新产生的留言条肯定在事件绑定前，所以需要借助委托绑定
    let board = document.getElementsByClassName('wish-board')[0]
    this.onEventListener(board, 'mousedown', 'wish-msg', this.handleMouseDown)
    // 移动鼠标
    window.addEventListener('mousemove', this.handleMouseMove)
    // 松开鼠标
    window.addEventListener('mouseup', this.handleMouseUp)

    // 双击，纸条消失
    this.onEventListener(board, 'dblclick', 'wish-msg', this.handleRemove)
  },
  randomNum: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  },
  onEventListener: function (parentNode, action, childClassName, callback) {
    parentNode.addEventListener(action, (e) => {
      // 问题，这里怎么处理，子元素和父元素的冒泡类的问题
      if (e.target.className.indexOf(childClassName) !== -1) {
        // if (e.target.className === childClassName) {
        callback(e)
      }
    })
  },
  addMsgs: function () {
    this.data.msg.forEach(item => {
      PAGE.addMsg(item.name, item.text)
    })
  },
  addMsg: function (name, text) {
    let board = document.getElementsByClassName('wish-board')[0]

    let card = document.createElement('div')
    let cardName = document.createElement('div')
    let cardText = document.createElement('div')

    card.setAttribute('class', 'wish-msg');
    cardName.setAttribute('class', 'wish-msg__name');
    cardText.setAttribute('class', 'wish-msg__text');
    // 设定位置
    card.style.left = PAGE.randomNum(0, board.clientWidth - PAGE.data.itemWidth) + 'px'
    card.style.top = PAGE.randomNum(0, board.clientHeight - PAGE.data.itemHeight) + 'px'

    cardName.innerHTML = name + '说:';
    cardText.innerHTML = text;

    card.append(cardName, cardText)
    card.style.zIndex = PAGE.data.zIndex++;
    card.style.backgroundColor = PAGE.data.backgroundColors[card.style.zIndex % PAGE.data.backgroundColors.length];

    board.append(card)
  },
  handleSubmit: function () {
    let msgInput = document.getElementById('msg-input');
    if (!msgInput.value || !msgInput.value.trim()) return

    PAGE.addMsg('Anonymous', msgInput.value)
  },
  handleMouseDown: function (e) {
    PAGE.data.isLocked = false;
    let item = e.target;
    // 如果点到了子节点，不存子节点（wish-msg__name），存wish-msg
    if (item.className.indexOf('wish-msg__') !== -1) {
      item = e.target.parentNode
    }
    PAGE.data.pageX = e.pageX;
    PAGE.data.pageY = e.pageY;
    PAGE.data.offsetLeft = item.offsetLeft;
    PAGE.data.offsetTop = item.offsetTop;

    // 将item放进去,确保操作的元素和点击的元素是同一个
    PAGE.data.item = item;
    item.style.zIndex = ++PAGE.data.zIndex;
  },
  handleMouseMove: function (e) {
    if (PAGE.data.isLocked) return

    let board = document.getElementsByClassName('wish-board')[0]
    // 确定边界！确定鼠标滑出去后，依然可操控
    let left = e.pageX - PAGE.data.pageX + PAGE.data.offsetLeft;
    let leftMin = 0
    let leftMax = board.clientWidth - PAGE.data.itemWidth;
    left = left <= leftMin ? leftMin : left;
    left = left >= leftMax ? leftMax : left;

    let top = e.pageY - PAGE.data.pageY + PAGE.data.offsetTop;
    let topMin = 0
    let topMax = board.clientHeight - PAGE.data.itemHeight;
    top = top <= topMin ? topMin : top;
    top = top >= topMax ? topMax : top;

    // 将mousedown时存的e.target拿出来改变，防止鼠标移出去后改变了操作对象
    let item = PAGE.data.item
    item.style.left = left + 'px'
    item.style.top = top + 'px'
  },
  handleMouseUp: function () {
    PAGE.data.isLocked = true;
  },
  handleRemove: function (e) {
    // 弹出确认框
    let item = e.target;
    if (item.className.indexOf('wish-msg__') !== -1) {
      item = e.target.parentNode
    }
    if (confirm('确定删除该留言吗？')) {
      item.parentNode.removeChild(item)
    }
  }

};
PAGE.init()

