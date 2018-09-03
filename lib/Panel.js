import React from 'react'
import Paper from './Paper'
import propTypes from 'prop-types'
   
class Panel extends React.Component {
    
	render(){

		// default styling
		const _style = {
			wrapper : {
				margin: 0,
				padding: 0,
				overflow: 'hidden',
				width: '100%'
			},

			// get padding from parent style prop
			innerContainer : this.props.padding !== undefined ? this.props.style.padding : '20px' 
		}

		const insideContainerSyle = this.props.containerStyle ? this.props.containerStyle : {}

		return (
			<Paper style={_style.wrapper} { ...this.props } >
				<div style={{ 
					padding: _style.innerContainer, 
					width: '100%', 
					boxSizing: 'border-box', 
					...insideContainerSyle 
				}}>
					{ this.props.children }
				</div>
			</Paper>
		)
	}
}

Panel.propTypes = {
	containerStyle: propTypes.object,
	padding: propTypes.number,
	style: propTypes.object,
}

export default Panel
