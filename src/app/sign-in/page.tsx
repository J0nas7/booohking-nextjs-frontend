import { ServerAuth } from '@/layout/ServerAuth'
import { SignInPage } from '@/views'

const Page = () => {
    return (
        <ServerAuth>
            <SignInPage />
        </ServerAuth>
    )
}

export default Page
