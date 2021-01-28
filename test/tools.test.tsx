import { withSuperJSONPage } from "../src/tools"
import { render } from "@testing-library/react-native"
import * as React from "react"

describe("tools", () => {
  describe("a component wrapped withSuperJSONPage", () => {
    describe("when used from a test", () => {
      it("works", () => {
        function Greeter(props: { name: string }) {
          return (
            <p>
              Greetings, {props.name}!
            </p>
          )
        }

        const WrappedGreeter = withSuperJSONPage(Greeter)

        const GreeterFromTest = WrappedGreeter as any as typeof Greeter

        const result = render(<GreeterFromTest name="Earthling" />)
        expect(result.toJSON().children).toEqual([
          "Greetings, ", "Earthling", "!"
        ])
      })
    })
  })
})