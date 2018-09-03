import propTypes from 'prop-types'
import styled from 'styled-components'

const Paper = styled.div`
	background: rgba(255, 255, 255, .1);
	border: 0;
	border-radius: ${ props => props.square ? 0 : '8px' };
	box-sizing: border-box !important;
	color: #fff;
	display: ${ props => props.flex ? 'flex' : 'inline-block'};
	padding: 20px;
	width: 100%;
`

Paper.propTypes = {
	flex: propTypes.bool,
	square: propTypes.bool,
}

export default Paper