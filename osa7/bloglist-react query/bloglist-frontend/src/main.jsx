import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './NotificationContext'
import { UserContextProvider } from './UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserListContextProvider } from './UserListContext'
import { BrowserRouter } from 'react-router'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserContextProvider>
        <UserListContextProvider>
          <NotificationContextProvider>
            <App />
          </NotificationContextProvider>
        </UserListContextProvider>
      </UserContextProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
