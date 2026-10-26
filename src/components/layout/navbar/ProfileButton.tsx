import { User } from 'lucide-react'
import { useUiStore } from '../../../store/uiStore'
import { useUserStore } from '../../../store/userStore'
import IconButton from './IconButton'

export default function ProfileButton() {
  const user = useUserStore((s) => s.user)
  const openPanel = useUiStore((s) => s.openPanel)

  return (
    <IconButton label={user ? `Account: ${user.name}` : 'Log in'} onClick={() => openPanel('auth')}>
      <User size={20} aria-hidden="true" />
    </IconButton>
  )
}
