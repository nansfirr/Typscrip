import { usePizzaOfTheDay } from "./usePizzaOfTheDay";

const intl = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
})

const PizzaOfTheDay = () => {
    const pizzaOfTheDay = usePizzaOfTheDay();

    if (!pizzaOfTheDay) {
        return <div>CHILL BRUH...</div>
    }

    return (
        <div className="mt-12.5 w-full border-t border-border">
            <h2 className="text-center">Pizza of the Day</h2>
            <div className="flex items-center justify-center">
                <div className="mr-7.5 text-center leading-loose">
                    <h3>{pizzaOfTheDay.name}</h3>
                    <p>{pizzaOfTheDay.description}</p>
                    <p className="pizza-of-the-day-price">
                        From: <span>{intl.format(pizzaOfTheDay.sizes.S)}</span>
                    </p>
                </div>
                <img
                    src={pizzaOfTheDay.image}
                    alt={pizzaOfTheDay.name}
                    className="max-w-50 rounded-[5px] border border-border"
                />
            </div>
        </div>
    )
}

export default PizzaOfTheDay;