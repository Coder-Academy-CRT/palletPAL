import React, { useContext, useState, useEffect } from 'react'
import api from '../../../api'
import palletpalContext from '../../../palletpalContext'

export default function EditPallet() {
    const {
        state: { products, microModes, selectedPallet, lots },
        dispatch
    } = useContext(palletpalContext)
    // keep track local change before send to db
    const [productList, setProductList] = useState(
        selectedPallet.products_on_pallet.slice()
    )
    const [newProduct, setNewProduct] = useState({
        lot_code: '',
        bag_size: '',
        number_of_bags: ''
    })
    const [newProductList, setNewProductList] = useState([])

    const [currentLots, setCurrentLots] = useState([])

    // --------------------------------------------------- //
    // ----------------------STYLE------------------------ //

    const cardWrapper = {
        position: 'absolute',
        top: 'calc(100vh/2 - 300px)',
        left: 'calc(100vw/2 - 500px)',
        width: '900px',
        height: '500px',
        borderRadius: '10px',
        backgroundColor: 'white',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '5'
    }

    const title = {
        marginBottom: '1rem'
    }

    const instruction = {
        background: 'lightGrey',
        width: '85%',
        fontSize: '0.8rem',
        marginBottom: '2rem',
        padding: '10px 8px',
        lineHeight: '1.5'
    }

    const inputWrapper = {
        display: 'flex',
        alignItems: 'center'
    }

    const newInputWrapper = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '10px'
    }

    const productDiv = {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '10px'
    }

    const fieldDiv = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
    }

    const smlBtn = {
        fontSize: '1.2rem',
        padding: '0px 2px',
        border: 'none',
        background: 'none',
        marginLeft: '10px'
    }

    const buttonWrapper = {
        marginTop: '1rem'
    }

    const buttonStyle = {
        padding: '5px 20px',
        margin: '20px 50px'
    }

    // ----------------------STYLE------------------------ //
    // --------------------------------------------------- //

    // Use to create drop down list for lot_code
    useEffect(() => {
        const newList = []
        lots.forEach((lot) =>
            newList.push({ value: lot.lot_code, label: lot.lot_code })
        )
        // set state from option lists
        setCurrentLots(newList)
    }, [products])

    // Add new product - dropdown list for lot code, 2x input for bag size and number of bags
    const createField = () => {
        return (
            <div style={newInputWrapper}>
                <div>
                    <select
                        name='lot_code'
                        value={newProduct.lot_code}
                        onChange={handleChange}>
                        <option value='' disabled>
                            Please select lot code
                        </option>
                        {currentLots ? (
                            <>
                                {currentLots.map((element, index) => (
                                    <option value={element.value} key={index}>
                                        {element.label}
                                    </option>
                                ))}
                            </>
                        ) : null}
                    </select>
                    <input
                        type='number'
                        min='0'
                        placeholder='bag size'
                        onChange={handleChange}
                        name='bag_size'
                        size='10'
                        value={newProduct.bag_size}
                    />
                    <input
                        type='number'
                        min='0'
                        placeholder='num of bags'
                        onChange={handleChange}
                        name='number_of_bags'
                        size='10'
                        value={newProduct.number_of_bags}
                    />
                    <button
                        style={smlBtn}
                        type='button'
                        onClick={createProduct}>
                        +
                    </button>
                </div>
            </div>
        )
    }

    // handle user input when edit existing product
    function handleEditChange(e) {
        const productId = e.target.parentElement.parentElement.id
        const index = productList.findIndex(
            (product) => product.product_id == productId
        )
        let copyOfProduct = Object.assign({}, productList[index])

        if (e.target.name == 'lot_code') {
            copyOfProduct.lot_code = e.target.value
        } else if (e.target.name == 'bag_size') {
            copyOfProduct.bag_size = e.target.value
        } else if (e.target.name == 'number_of_bags') {
            copyOfProduct.number_of_bags = e.target.value
        }

        let copyOfProduct2 = [...productList]
        copyOfProduct2[index] = copyOfProduct
        setProductList(JSON.parse(JSON.stringify(copyOfProduct2)))
    }

    // handle user input when create new product
    const handleChange = (e) => {
        setNewProduct((prevState) => {
            return {
                ...prevState,
                [e.target.name]: e.target.value
            }
        })
    }

    // create new product
    const createProduct = (e) => {
        e.preventDefault()
        // store the 'new' product in newProductList temporarily, and send request to db when user click 'confirm' button
        setNewProductList([...newProductList, newProduct])
        // reset input field placeholder value
        setNewProduct({
            lot_code: '',
            bag_size: '',
            number_of_bags: ''
        })
    }
    function handleAddProductAPICall(message) {
        newProductList.forEach(async (product) => {
            try {
                const response2 = await api.post(
                    `pallet/${selectedPallet.pallet_id}/products`,
                    product
                )
                if (response2.data.hasOwnProperty('product_id')) {
                    // use response object to update Products as it should be a whole object
                    dispatch({
                        type: 'addNewProductToProducts',
                        data: response2.data
                    })
                    message.push('success')
                }
            } catch (err) {
                alert(
                    'Product could not be created. Please close and try again later'
                )
                message.push('error')
            }
        })
    }

    // API call
    function handleEditAPICall(message) {
        // Add new products to the pallet first
        productList.forEach(async (product) => {
            // Find the new seed type and seed variety after user change the lot code
            const seedData = lots.filter(
                (lot) => lot.lot_code == product.lot_code
            )
            try {
                const response = await api.put(
                    `product/${product.product_id}`,
                    {
                        lot_code: product.lot_code,
                        bag_size: product.bag_size,
                        number_of_bags: product.number_of_bags
                    }
                )
                if (response.data == `product ${product.product_id} updated`) {
                    dispatch({
                        type: 'editProductsAfterEdit',
                        payload: {
                            product: product,
                            product_id: product.product_id,
                            seed_type: seedData[0].seed_type,
                            seed_variety: seedData[0].seed_variety
                        }
                    })
                    message.push('success')
                }
            } catch (err) {
                alert(
                    'Product could not be updated. Please close and try again later'
                )
                message.push('error')
            }
        })
    }

    // handle when user delete individual product before they click confirm
    const handleRemove = (e) => {
        e.preventDefault()
        const filteredList = newProductList.filter(
            (product, index) => index != e.target.parentElement.id
        )
        setNewProductList(filteredList)
    }

    // confirm button
    const handleSubmit = (e) => {
        const message = []
        e.preventDefault()
        const resolved = confirm('Confirm?')
        if (resolved) {
            if (newProductList.length != 0) {
                handleAddProductAPICall(message)
            }
            handleEditAPICall(message)
            // Close edit box
            dispatch({
                type: 'setMicroMode',
                data: { mode: 'Edit', bool: false }
            })
        } else {
            dispatch({
                type: 'setMicroMode',
                data: { mode: 'Edit', bool: false }
            })
        }
        if (!message.includes('error')) {
            alert('Pallet has been updated')
        }
    }

    // Cancel button
    const handleClose = (e) => {
        e.preventDefault()
        dispatch({ type: 'setMicroMode', data: { mode: 'Edit', bool: false } })
    }

    return (
        <div style={cardWrapper}>
            <div style={title}>
                <h1>Edit - Pallet #{selectedPallet.pallet_id}</h1>
            </div>
            <div style={instruction}>
                <p>
                    * Each product you can edit their lot code, bag size and
                    number of bags.
                </p>
                <p>
                    * You can edit the lot code by selecting the new code from a
                    dropdown list.
                </p>
                <p>
                    * You can edit the bag size and number of bags by simply
                    enter the new amount.
                </p>
                <p>
                    * You can add a new product by select the lot code and enter
                    the value, follow by clicking the + button.
                </p>
                <p>* Please click confirm to confirm the changes.</p>
            </div>
            <form>
                {selectedPallet.products_on_pallet.map((product, index) => (
                    <div
                        style={inputWrapper}
                        key={product.product_id}
                        id={product.product_id}
                        pos={index}>
                        <div>
                            <select
                                name='lot_code'
                                value={productList[index].lot_code}
                                onChange={handleEditChange}>
                                <option value='' disabled>
                                    Please select lot code
                                </option>
                                {currentLots ? (
                                    <>
                                        {currentLots.map((element, index) => (
                                            <option
                                                value={element.value}
                                                key={index}>
                                                {element.label}
                                            </option>
                                        ))}
                                    </>
                                ) : null}
                            </select>
                        </div>
                        <div>
                            <input
                                type='number'
                                min='0'
                                value={productList[index].bag_size}
                                onChange={handleEditChange}
                                name='bag_size'
                                size='10'
                            />
                        </div>
                        <div>
                            <input
                                type='number'
                                min='0'
                                value={productList[index].number_of_bags}
                                onChange={handleEditChange}
                                name='number_of_bags'
                                size='10'
                            />
                        </div>
                    </div>
                ))}
                <div>
                    {newProductList.length != 0 ? (
                        <div>
                            {newProductList.map((product, index) => (
                                <div style={productDiv} id={index} key={index}>
                                    <div style={fieldDiv}>
                                        {product.lot_code}
                                    </div>
                                    <div style={fieldDiv}>
                                        {product.number_of_bags} bags
                                    </div>
                                    <div style={fieldDiv}>
                                        {product.bag_size} kg each
                                    </div>
                                    <button
                                        style={smlBtn}
                                        type='button'
                                        onClick={handleRemove}>
                                        x
                                    </button>
                                </div>
                            ))}
                            {createField()}
                        </div>
                    ) : (
                        createField()
                    )}
                </div>
                <div style={buttonWrapper}>
                    <button
                        style={buttonStyle}
                        type='button'
                        onClick={handleClose}>
                        Cancel
                    </button>
                    <button style={buttonStyle} onClick={handleSubmit}>
                        Confirm
                    </button>
                </div>
            </form>
        </div>
    )
}
