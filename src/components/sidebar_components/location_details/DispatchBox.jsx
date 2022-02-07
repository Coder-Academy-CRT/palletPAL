import React, { useContext, useState } from 'react'
import palletpalContext from '../../../palletpalContext'

export default function DispatchBox() {
	const { state: { selectedPallet }, dispatch } = useContext(palletpalContext)

	// This state is for the delete button next to each product (when user want to dispatch the whole product)
	const [productList, setProductList] = useState(selectedPallet.products_on_pallet)
	// Use to store form data and update it to productList once user hit dispatch
	const [copyProductList, setCopyProductList] = useState(productList)

	const style = {
			position: "absolute",
			top: "calc(100vh/2 - 200px)",
			left: "calc(100vw/2 - 500px)",
			width: "500px",
			height: "300px",
			borderRadius: "10px",
			backgroundColor: "white",
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			alignItems: "center"
	}

	const styleButton = {
		padding: "5px 20px",
		margin: "20px 50px"
	}

	const styleWrapper = {
		display: "flex",
		justifyContent: "space-between",
	}

	// Update the number of bags that user want to dispatch
	const handleChange = (e) => {
		// product id of that product
		const productId = e.target.parentElement.parentElement.id

		const updatedProductInfo = copyProductList.map(product => {
			if (product.product_id == productId) {
				// e.target.value is the number of bags that user want to dispatch
				return { ...product, number_of_bags: e.target.value }
			}
			return product
		})
		setCopyProductList(updatedProductInfo)
	}


	// Delete(dispatch) button next to each product
	const handleDelete = (e) => {
		const isConfirmed = confirm("You want to dispatch this product?")
		if (isConfirmed) {
			// update number of bag to 0 and filter out later
			const productId = e.target.parentElement.id
			const updatedProductInfo = productList.map(product => {
				if (product.product_id == productId) {
					return { ...product, number_of_bags: 0 }
				}
				return product
			})
			setProductList(updatedProductInfo)
		}
	}

	// Close button
	const handleClose = () => {
		dispatch({
			type: 'setPalletOption',
			data: ''
		})
	}

	// Dispatch button
	const handleSubmit = (e) => {
		e.preventDefault()
		
		const isConfirmed = confirm("You want to dispatch all products?")
		if (isConfirmed) {
			// Update productList.number_of_bags with the dispatched number of bags
			for ( let i = 0; i < productList.length; i++ ) {
				for ( let k = 0; k < copyProductList.length; k++) {
				  if (copyProductList[k].pallet_id == productList[i].pallet_id) {
					productList[i].number_of_bags = (productList[i].number_of_bags - copyProductList[k].number_of_bags)
				}
			  }
			}
			// Update selectedPallet data
			dispatch({
				type: "updatePalletDataAfterDispatch",
				data: productList
			}),
			// Update products data with the updated selectedPallet data
			dispatch({
				type: 'updateProducts', 
				data: productList
			}),
			// To close the dispatch box
			dispatch({
				type: 'setPalletOption',
				data: ""
			})
			alert("Products have been dispatched")
			}
	}


  return (
      <div style={style}>
			<div className='text-wrapper'>
				<h1 style={{ textAlign: "center"}}>Pallet #{selectedPallet.pallet_id}</h1>
				{productList.length > 0 ? 
					<form onSubmit={handleSubmit}>
					{productList.map(product => (
						product.number_of_bags > 0 ?  
						<div id={product.product_id} key={product.id} style={styleWrapper} >
							<div>
								<p>{product.seed_type.toUpperCase()}</p>
							</div>
							<div>
								<p>{product.lot_code}</p>
							</div>
							<div>
								<p>{parseInt(product.bag_size)} kg </p>
							</div>
							<div style={{ display: "flex"}}>
								<input 
									type="number"
									min="0"
									max={parseInt(product.number_of_bags)}
									size="5"
									name={product.id}
									placeholder={parseInt(product.number_of_bags)}
									onChange={handleChange}
									onInput={handleChange}
								/>
								<p style={{marginLeft: "5px"}}>BAG</p>
							</div>
							<button style={{ padding: "0 3px"}} onClick={handleDelete}>X</button>
						</div>
						: <p>Product has been dispatched</p>
					))}
						<div className='button-wrapper'>
							<button style={styleButton} onClick={handleClose}>Cancel</button>
							<button type="submit" style={styleButton} onClick={handleSubmit}>Dispatch</button>
						</div>
					</form>
					: (
						<div style={{ textAlign: "center"}}>
							<h3>No product exist on this pallet, this pallet will be removed.</h3>
							<button style={styleButton} onClick={handleClose}>Confirm</button>
						</div>
					)}
			</div>
      </div>

  ) 
}
