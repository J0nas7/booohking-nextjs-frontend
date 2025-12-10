import { ServerAuth } from '@/layout/ServerAuth'
import { RegisterPage } from '@/views'

const Page = () => (
    <ServerAuth>
        <RegisterPage />
    </ServerAuth>
)

export default Page
