import { renderHook } from "@testing-library/react-hooks";
import MockAdapter from "axios-mock-adapter";

import { useAuth, AuthProvider } from "../../hooks/auth";
import api from "../../services/api";

const apiMock = new MockAdapter(api);

describe("Auth hook", () => {
    it("should be able to sign in", async () => {
        const apiRes = {
            user: {
                id: "user-123",
                name: "John Doe",
                email: "john@doe.com",
            },
            token: "token-123",
        };

        apiMock.onPost("sessions").reply(200, apiRes);

        const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

        const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        result.current.signIn({
            email: "john@doe.com",
            password: "123456",
        });

        await waitForNextUpdate();

        expect(setItemSpy).toHaveBeenCalledWith(
            "@GoBarber:token",
            apiRes.token,
        );
        expect(setItemSpy).toHaveBeenCalledWith(
            "@GoBarber:user",
            JSON.stringify(apiRes.user),
        );

        expect(result.current.user.email).toEqual("john@doe.com");
    });
});
