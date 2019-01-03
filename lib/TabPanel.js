import React from 'react'
import propTypes from 'prop-types'
import Paper from './Paper'
import Panel from './Panel'
import styled from 'styled-components'

class TabPanel extends React.Component {
		
	constructor(props){
		super(props)

		this.state = {

			// Child component counter
			childCount: 0,

			// default child comp to be shown
			componentToShow : 0,

			// current theme
			theme: null
		}

		this.switchToTab = this.switchToTab.bind(this)
	}

	componentWillMount(){
		// set default tab (index) to show
		this.switchToTab(this.props.showTab)

		let newState = {}
		
		// Add available number (in base 0)
		// of child elements to state excluding
		// children not matching menu indices
		if (this.props.children !== undefined){

			// Length -1 to get zero based length
			let count = React.Children.count(this.props.children) - 1

			while ( count >= this.props.menu.length ){
				count--
			}
			
			newState.childCount = count
		}

		// get theme current theme
		if ( this.props.theme ){
			newState.theme = this.props.theme
		}

		this.setState((prevState) => ({...newState}))
	}

	componentDidMount(){
		// set default tab (index) to show
		this.switchToTab(this.props.showTab)
	}
	
	componentDidUpdate(prevProps){
		// Allow shown tab to change
		if ( this.props.showTab !== undefined && this.props.showTab !== prevProps.showTab ){
			this.switchToTab(this.props.showTab)
		}

		// update current theme if changed
		if ( this.props.theme != prevProps.theme){
			this.setState((prevState) => ({ theme: this.props.theme }))
		}

	}

	// Display the child comp with the same 
	// index as the menu item clicked
	switchToTab(itemIndex){
		let count = this.state.childCount
		let men   = this.props.menu

		// make sure given index does 
		// not surpass available child elements
		if ( itemIndex <= count){
			this.setState(( prevState ) => ( {componentToShow: itemIndex } ))

			// Return shown tab index
			// to allow other comps
			// control over tabs
			if ( this.props.activeTab ){
				this.props.activeTab({
					index: itemIndex,
					count: count,
					menuList: men
				})
			}
		}
	}
		
	render(){

		let _style = {
			containers: {
				padding: '0px',
				width: '100%',
				boxSizing: 'border-box',
				display: 'flex',
				overflow: 'hidden'
			},
			menuContainer: {
				display: 'flex',
				width: '100%',
				justifyContent: 'space-around'
			},
			menu: {
				border: '0 0 1px 0',
				borderRadius: 0,
				boxShadow: 0,
				marginBottom: 0,
				display: 'flex',
				padding: 0,
				overflow: 'hidden',
				background: 'rgba(0,0,0,0.2)',
				width: '100%'
			},
			menu_items: {
				textDecoration: 'none',
				textTransformation: 'capitalize',
				color: '#fff',
				display: 'inline-block',
				padding: '20px',
				cursor: 'pointer'
			}
		}

		let menuOrientation = this.props.menuOrientation
		let coloredBorder

		// Tab and content styles for row layout
		if (menuOrientation === 'column'){
			coloredBorder = { borderBottom: '2px' }
			
			if ( this.props.reverse ){
				menuOrientation = 'column-reverse'
				coloredBorder = { borderTop: '2px' }
			}
		}

		// Tab and content styles for row layout
		if (menuOrientation === 'row'){
			_style.menu.width          = 'auto'

			_style.menuContainer.width = 'auto'
			_style.menuContainer.flexDirection = 'column'
			coloredBorder = { borderRight: '2px' }
			
			if ( this.props.reverse ){
				menuOrientation = 'row-reverse'
				coloredBorder = { borderLeft: '2px' }
			}
		}
			
		const Item = styled(Paper)`
			background: none;
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			text-align: center;
			user-select: none;
			&:hover{
				color: #000;
				background: ${ this.state.theme !== null ? this.state.theme.accent : 'unset'};
				cursor: pointer;
			};
			border-color: ${ this.state.theme !== null ? this.state.theme.accent : 'unset' } !important;
		`
		const MenuItems = props => {

			if ( this.props.menu){
				if ( this.props.menu.length > 1 ){

					return <div style={ _style.menuContainer }>
						{ this.props.menu.map((menu, index) => {

							// Style for the active tab
							let activeTabStyle = this.state.componentToShow === index ? {...coloredBorder, borderStyle: 'solid', background: 'rgba(255,255,255,.1)'} : {}

							return <Item style={ activeTabStyle } square key={index} onClick={ e => {

								let shouldTabsSwitch

								// invoke menu onClick function if present
								if (menu.hasOwnProperty('onClick')){
									shouldTabsSwitch = menu.onClick()
								}
									
								// switch to requested tab unless no children are available
								// and the tab's menu onclick function returns false
								if (this.props.children !== undefined && shouldTabsSwitch !== false) this.switchToTab(index)
														
							}}>{menu.title}</Item> })
						}
					</div>

				}else if ( this.props.menu.length === 1 ){
					return <Item style={_style.menu_items} href="">{this.props.menu[0].title}</Item>
				}

				// menu is empty
				return null
			}
		}

		// contains menu items 
		const Menu = props => <Paper shadow style={ _style.menu }>{props.children}</Paper>

		// Get children as an array
		let children = React.Children.toArray(this.props.children)

		// Enforce accepted children type 
		// by making sure children are of type 'Panel'
		let childrenAreValid = true

		children.map(child => {
			if ( child.type !== Panel ){
				childrenAreValid = false
			}
		})

		let { style } = this.props.style? this.props : {}

		return(
			<Panel 
				{...this.props} 
				style={{ ..._style.containers, ...style }} 
				containerStyle={{ 
					padding: 0, 
					display: 'flex', 
					flexDirection: menuOrientation
				}}>
						
				{ this.props.menu && <Menu><MenuItems /></Menu> }
					
				<div style={{ ..._style.containers, display: 'flex', flex: 1 }}>

					{/* Make sure child components exist to display */}
					{ !! this.props.children && childrenAreValid && children[this.state.componentToShow] }

				</div>
			</Panel>
		)
	}
}

TabPanel.defaultProps = {
	menuOrientation: 'column'
}

TabPanel.propTypes = {

	menu: propTypes.arrayOf( propTypes.object ),
	
	// property determining the column direction
	reverse: propTypes.bool,

	// get index of tab to be active
	showTab: propTypes.number,

	// return index of active tab
	activeTab: propTypes.func,

	// menu orientation
	menuOrientation: propTypes.oneOf(['column', 'row']),

	// Display error if children are not of type 'Panel'
	children: function (props, propName, componentName) {
		const prop = props[propName]
		let error  = null
		let c      = 0

		React.Children.forEach(prop, function (child) {
			if (child.type !== Panel) {
				c++
				error = new Error(`'${componentName}' children must be of type 'Panel'. found ${c} invalid`)
			}
		})
		return error
	}
}

export default TabPanel
