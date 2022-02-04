import { useState, useEffect, useContext } from 'react'
import palletpalContext from '../../../palletpalContext'
import CustomSelect from './CustomSelect'
import Summary from './Summary'

function SearchWindow() {
    const [active, setActive] = useState(true)
    const [seeds, setSeeds] = useState([])
    const [lots, setLots] = useState([])
    const [options, setOptions] = useState(null)
    const [summary, setSummary] = useState(null)
    const {
        dispatch,
        state: { products, foundPallets }
    } = useContext(palletpalContext)

    useEffect(() => {
        // declare temp lists for working
        let seedList = new Set([])
        let seedOptions = []
        let lotList = new Set([])
        let lotOptions = []

        // get every current lot and seed and push to temp lists
        products.forEach((element) => {
            seedList.add(
                `${element.seed_type} - ${element.seed_variety}`.toLowerCase()
            )
            lotList.add(`${element.lot_code}`)
        })

        // build options lists
        seedList.forEach((seed) => {
            seedOptions.push({ value: seed, label: seed })
        })
        lotList.forEach((lot) => {
            lotOptions.push({ value: lot, label: lot })
        })

        // set state from option lists
        setSeeds(seedOptions)
        setLots(lotOptions)
    }, [])

    function setOff() {
        setActive(false)
        dispatch({
            type: 'setFoundPallets',
            data: []
        })
    }

    function setOn() {
        setActive(true)
    }

    function search(event) {
        const searchValue = event.target.value
        let bags = 0
        let totalWeight = 0
        const foundPalletIds = new Set([])
        let matchingProducts = products.filter(
            (product) =>
                product.lot_code == searchValue ||
                `${product.seed_type} - ${product.seed_variety}` == searchValue
        )

        matchingProducts.forEach((product) => {
            bags += Number(product.number_of_bags)
            totalWeight +=
                Number(product.number_of_bags, 2) * Number(product.bag_size, 2)
            foundPalletIds.add(product.pallet_id)
        })
        setSummary({
            kind: searchValue,
            bags: bags,
            totalWeight: totalWeight
        })
        dispatch({
            type: 'setFoundPallets',
            data: Array.from(foundPalletIds)
        })
    }

    // only render while active
    if (active) {
        return (
            <div id='searchWindow'>
                <button onClick={setOff}>close Search</button>
                <h3>Search</h3>
                <section id='searchModes'>
                    <button
                        className='searchOption'
                        onClick={() => {
                            setOptions(lots)
                        }}>
                        LOTS
                    </button>
                    <button
                        className='searchOption'
                        onClick={() => {
                            setOptions(seeds)
                        }}>
                        SEEDS
                    </button>
                </section>
                <CustomSelect
                    options={options}
                    name='searchDropdown'
                    watching={options}
                    change={(e) => search(e)}
                />
                <Summary summary={summary} />
            </div>
        )
    } else {
        return (
            <div id='searchWindow'>
                <button onClick={setOn}>open Search</button>
            </div>
        )
    }
}

export default SearchWindow
