import { useEffect } from 'react'
import { Container } from '../../components/Container'
import { GenericHtml } from '../../components/GenericHtml'
import { Heading } from '../../components/Heading'
import { RouterLink } from '../../components/RouterLink'
import { MainTemplate } from '../../templates/MainTemplate'

export function NotFound() {
  useEffect(() => {
    document.title = 'Página não encontrada - Chronos Pomodoro'
  }, [])

  return (
    <MainTemplate>
      <Container>
        <GenericHtml>
          <Heading>404 - Página não encontrada 🚀</Heading>

          <p>
            Opa! Parece que a página que você está tentando acessar não existe.
          </p>

          <p>
            Dá pra voltar para a{' '}
            <RouterLink href="/">
              página principal
            </RouterLink>
            .
          </p>

          <p>
            Enquanto isso, fica aqui uma reflexão:
            "Se uma página não existe na internet, será que ela existiu de
            verdade?" 🤔💭
          </p>
        </GenericHtml>
      </Container>
    </MainTemplate>
  )
}