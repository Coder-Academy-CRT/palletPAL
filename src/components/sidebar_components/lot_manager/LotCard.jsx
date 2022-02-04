import React, { useState, useContext } from "react"
import api from "../../../api"
import palletpalContext from "../../../palletpalContext"

function LotCard( {lot} ) {

    const { state: { warehouse }, dispatch } = useContext(palletpalContext)

    const [editMode, setEditMode] = useState(false)

    const [updatedLot, setUpdatedLot] = useState( { lot_code : lot.lot_code, seed_type: lot.seed_type, seed_variety: lot.seed_variety } )

    function setEditOn() {
        setEditMode(true)
    }

    function setEditOff() {
        setEditMode(false)
    }


    let bag_sizes = []
    let total_amount = 0

    for (let property in lot) {
        if (property != "lot_code" && property != "seed_variety" && property != "seed_type") {
            bag_sizes.push(
                <li>
                    {(`${property}kg bags:    `) + `${lot[property]}kg`}    
                </li>
            )
            total_amount += lot[property]
        }   
    }

    async function submit(event) {
        event.preventDefault()

        const res = await api.put(
            `/${warehouse.id}/lot/${lot.lot_code}`, 
            { 
                lot_code: updatedLot.lot_code,
                seed_type: updatedLot.seed_type,
                seed_variety: updatedLot.seed_variety
             } )

        dispatch({
            type: "",
            data: ""
        })
    }
 
  

    if (editMode) {
        return (
            <div className='editLotCard'>


                <h2>{lot.lot_code}</h2>

                <div>

                    <form onSubmit={submit}>
                        <div id="lotForm">
                            <label for="lotCode">Please enter lot code:</label>
                            <input
                                class="lotInputs"
                                id="lotCode"
                                value={updatedLot.lot_code}
                                onChange={(event) => setUpdatedLot(event.target.value)}
                            ></input>

                            <label for="lotSeedType">Please select seed type:</label>
                            <input
                                class="lotInputs"
                                id="lotSeedType"
                                value={updatedLot.seed_type}
                                onChange={(event) => setUpdatedLot(event.target.value)}
                            ></input>

                            <label for="lotSeedType">Please select seed variety</label>
                            <input
                                class="lotInputs"
                                id="lotSeedVariety"
                                value={updatedLot.seed_variety}
                                onChange={(event) => setUpdatedLot(event.target.value)}
                            ></input>
                            
                        </div>
                        <button>Submit</button>
                    </form>
                </div>

                <div id='buttonContainer'>
                    <button onClick={setEditOff}>save</button>
                    <button onClick={setEditOff}>exit</button>
                </div>
               







            </div>
        )
    } else {
        return (
            <>
                <div className='lotCard'>
                    <div id="lotCardLhs">
                        <button onClick={setEditOn}>edit</button>
                        <div>
                            <h2>{lot.lot_code}</h2>
                            <p>{`${lot.seed_type} - ${lot.seed_variety}`}</p>
                        </div>
                    </div>
                    <div id="lotCardRhs">
                        <ul>
                            { bag_sizes }
                        </ul>
                        <h3>{
                            total_amount == "0" ? "no stock" : `Total: ${total_amount} kg` }
                        </h3>
                    </div>  
                </div>
             
            </>
        )
    }
}

export default LotCard
