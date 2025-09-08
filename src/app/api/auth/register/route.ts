import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, validatePassword, validateEmail } from '@/lib/password';
import { createUserWithPassword, findUserByEmailAndProvider } from '@/models/user';
import { CreditsAmount, CreditsTransType, increaseCredits } from '@/services/credit';
import { getOneYearLaterTimestr } from '@/lib/time';

export async function POST(req: NextRequest) {
  try {
    const { email, password, nickname } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      );
    }

    // Check if user already exists with this email for credentials provider
    const existingUser = await findUserByEmailAndProvider(email, 'credentials');
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await createUserWithPassword({
      email,
      password_hash: passwordHash,
      nickname: nickname || email.split('@')[0],
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Give new user 10 credits (same as OAuth registration)
    try {
      await increaseCredits({
        user_uuid: user.uuid,
        trans_type: CreditsTransType.NewUser,
        credits: CreditsAmount.NewUserGet,
        expired_at: getOneYearLaterTimestr(),
      });
      console.log(`✅ Awarded ${CreditsAmount.NewUserGet} credits to new user: ${user.email}`);
    } catch (creditError) {
      console.error('Failed to award credits to new user:', creditError);
      // Don't fail registration if credit award fails
    }

    // Return success response (without password hash)
    return NextResponse.json({
      success: true,
      user: {
        uuid: user.uuid,
        email: user.email,
        nickname: user.nickname,
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}