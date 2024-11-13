
# Exercício Prático de Git

Este exercício prático tem como objetivo trabalhar com conceitos de branching, commits, pull requests e integração de alterações em um repositório Git compartilhado.

## Instruções

1. **Acesse o Repositório:**
   - Abra o repositório no GitHub: [https://github.com/saviotom/novo-repo](https://github.com/saviotom/novo-repo).

2. **Clone o Projeto:**
   - Abra o terminal e clone o repositório para uma pasta local:
     
     git clone https://github.com/saviotom/novo-repo.git
     
   - Entre na pasta do projeto:
     
     cd novo-repo
     

3. **Crie uma Branch com Seu Nome a Partir da Branch `develop`:**
   - Certifique-se de que está na branch `develop`:
     
     git checkout develop
     
   - Crie uma nova branch com seu nome, conforme o padrão especificado (exemplo: `feat-seu-nome`):
     
     git checkout -b feat-seu-nome
     
     _(Substitua `seu-nome` pelo seu nome completo ou como indicado pelo professor)_

4. **Conecte a Branch Local à Branch Remota:**
   - Use o comando abaixo para conectar sua branch local à branch remota `develop`:
     
     git checkout -b feat-seu-nome origin/develop
     

5. **Adicione Seu Nome na Lista e Faça o Commit:**

   - Adicione seu nome na lista abaixo do nome do professo
    
     a. Sávio Tomé
     b. Seu nome
     
   - Salve o arquivo.
   - Em seguida, faça o commit da alteração:
     
     git add .
     git commit -m "Adicionando meu nome na lista"
     

6. **Envie (Push) Sua Branch para o Repositório Remoto:**
   - Envie sua branch para o repositório remoto no GitHub:
     
     git push -u origin feat-seu-nome
     

7. **Abra um Pull Request (PR):**
   - Acesse o repositório no GitHub.
   - Clique em "Compare & pull request" ou vá para a aba **Pull Requests** e inicie um novo PR a partir da sua branch `feat-seu-nome`.
   - Descreva brevemente a mudança (ex.: "Adicionei meu nome na lista") e envie o PR para revisão.

8. **Atualize sua Branch Caso a Branch `develop` seja Atualizada:**
   - Se o professor informar que a branch `develop` foi atualizada, siga os passos abaixo para sincronizar sua branch com as novas alterações:
     
     git checkout develop
     git pull origin develop
     git checkout feat-seu-nome
     git merge develop
     
   - Resolva qualquer conflito que possa surgir, faça o commit das alterações de merge, e envie as atualizações para o repositório remoto:
     
     git push
     

## Lista de Participantes

1. Sávio Tomé
2. Adriel Vinicius
<<<<<<< HEAD
3. Fabiola 

=======
3. Ithauana Sousa da Silva
4. ÁLEF NUNES MONTEIRO
5. gabriel guady
6. Riquelme Nascimento
7. Eliza Cecilia
8. Patricia Nascimento
9. Iane Oliveira
10. Alexsandro Moraes
11. Lucas Silva de Souza
12. João Eduardo
13. Antônio Santos
14. Fabricio Souza
15. Nycole pio
16. Marvin Matheus Oliveira
17. Francisco Felipe Barros dos Santos
18. gabriel coelho
19. Moises Souza
20. Fabiano Vasconcelos
21. Rely Fernandes
22. Fabiola
>>>>>>> develop


.