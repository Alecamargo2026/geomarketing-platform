import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Simulando um banco de dados em memória
const users: any[] = []
const tenants: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, tenantName } = await request.json()

    // Validar entrada
    if (!name || !email || !password || !tenantName) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se email já existe
    if (users.some((u) => u.email === email)) {
      return NextResponse.json(
        { message: 'Email já cadastrado' },
        { status: 400 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar tenant
    const tenantId = `tenant-${Date.now()}`
    const tenant = {
      id: tenantId,
      name: tenantName,
      slug: tenantName.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date(),
    }
    tenants.push(tenant)

    // Criar usuário
    const userId = `user-${Date.now()}`
    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      role: 'admin',
      tenantId,
      createdAt: new Date(),
    }
    users.push(user)

    // Gerar JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        tenantId: user.tenantId,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json({
      message: 'Conta criada com sucesso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
      },
      token,
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Erro ao criar conta' },
      { status: 500 }
    )
  }
}
