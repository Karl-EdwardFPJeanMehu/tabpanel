# React TabPanel

TabPanel is a React component that can easily create tab or "tab" like menus and layouts.
 
## How To Install
You can use either NPM or Yarn to install TabPanel. In your terminal or command prompt type the following

```
$ npm install tabpanel
```
or 
``` 
$ yarn add tabpanel 
```

## Usage
`TabPanel` comes along with a `Panel` component which it accepts as children. `Panel` s must wrap your content - text, images, other components etc..

```js
import TabPanel from 'tabpanel'

export class MyClass extends
return(

  const myMenu = [
    { title: 'Tab 1'},
    { title: 'Tab 2' }
  ];

  render(){
    return(
      <TabPanel menu={ myMenu }>
        <Panel>I'm in tab1</Panel>
        <Panel>I'm in tab 2</Panel>
      </TabPanel>
    );
  };
)
```

TabPanel will automatically place tabs according to the same order in which `Panel` children are arranged.  

### Properties

1. `menu` - `Array` (optional): An array of objects containing tab `title` s and optional `onClick` functions that are invoked before a tab's content appear. 

```js
  const myMenu = [
    { title: "Tab 1" },
    { title: "Tab 2" },
    {
      title: "I don't have a panel",
      onClick: () => {
        // do something
      }
    }
  ];

  render(){
    return(
      <TabPanel menu={ myMenu }>
        <Panel>I'm in tab1</Panel>
        <Panel>I'm in tab2</Panel>
      </TabPanel>
    );
  };
```

> **Note :** Notice there is a third object in *myMenu*. This can be a way to use tabs exclusively to invoke arbitrary functions. If a menu's *onClick* function returns false, that tab and its corresponding *Panel* will not be made active. Only tabs will ever invoke menu *onClick* functions.

2. `reverse` - `bool` (optional): Positions the tabs at the bottom rather than the top if set to `true`. Default is `false`.

3. `square` - `bool` (optional): gives a *TabPanel* or *Panel* square borders if set to true. Default is `false`. 

```html
  // square is equivalent to square={ true }
  <TabPanel square menu={ myMenu }>
    <Panel>I'm in tab1</Panel>
    <Panel>I'm in tab2</Panel>
  </TabPanel>
```

4. `showTab` - `number` (optional): Sets the default tab to be active given an index. Default is `0`. If value is greater than the available indices it will be ignored.

5. `activeTab` - `function` (optional): This function invokes a function within TabPanel. TabPanel will Returns an object with the current active tab, *index*, the number of panels, *count* and an array of the tab menu titles, *menuList*.

> **Note :** As mentioned in (1.), the number of tabs may be greater the number of panels but not vice-versa. Therefore, the returned object from `activeTab` will reflect only the tabs with matching panels.  
  
  Both the `showTab` and `activeTab` can used to control a `TabPanel` externally via other components or functions wether the `menu` props is set or not like the example below.

```js
  constructor(props){
    super(props);

    this.state = { 
      // Sets default active tab when 
      // parent (this) component loads or 
      // receives current tab when updated
      tabToShow: 0 
    };
  };

  changeTab(val){
    
    // If this function is called by activeTab 
    // it will be returned as an object property
    val = typeof val === "object" ? val.index : val;
    this.setState( (prevState) => ({tabToShow: val}) );
  };

  render(){
    return(
      <TabPanel 
        menu={ myMenu }
        showTab={ this.state.tabToShow }
        activeTab={ (e) => changeTab(e)}
        >
        <Panel>I'm in tab1</Panel>
        <Panel>I'm in tab2</Panel>
      </TabPanel>

      <button onClick={ () => changeTab(0)}>Show tab 1</button>
      <button onClick={ () => changeTab(1)}>Show tab 2</button>
    );
  };
```

This can be quite tedious if you have many tabs and panels. You can do something similar with a select tag:

```js
  constructor(props){
    super(props);

    this.state = { 
      tabToShow: 0,
      count: 0,
      menuList: []
    };
  };

  changeTab(val){
    let obj = {};
    
    // This is essentially the same trick as before.
    if ( typeof val === "object" ){
      obj.tabToShow = val.index;
      obj.count     = val.count;
      obj.menuList  = val.menuList;
    }else{
      obj.tabToShow = val
    }

    // setting state for index, count, etc
    // thank God for spread!
    this.setState( (prevState) => ({...obj}) );
  };

  render(){

    let Options = [];
    let men = this.state.menuList;

    // automatically generates the <option>'s 
    // with our menu titles for our select tag below 
    for(let i = 0; i <= this.state.count; i++){
      Options.push(
        <option key={i} value={i}>
        { men.length > 1 ? men[i].title : '' }
        </option>
      );
    };

    return(
      <TabPanel 
        menu={ myMenu }
        showTab={ this.state.tabToShow }
        activeTab={ (e) => changeTab(e)}
        >
        <Panel>I'm in tab1</Panel>
        <Panel>I'm in tab2</Panel>
      </TabPanel>

      <select 
        value={ this.state.val } 
        onChange={ (e) => this.selectHandler(e) }>
        {Options}
      </select>
    );
  }
```