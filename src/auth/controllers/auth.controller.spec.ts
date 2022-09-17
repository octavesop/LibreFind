import { HttpException, HttpStatus } from '@nestjs/common';
import { response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(() => {
    userRepository = userRepository;
    authService = new AuthService(userRepository, null);
    authController = new AuthController(authService, null);
  });

  describe('signUp', () => {
    it('회원가입 후 사용자 값을 반환합니다.', async () => {
      const result = {
        userUid: 1,
        userId: 'test',
        userPw: 'test',
        userName: 'test',
        userNickName: 'test',
        userEmail: 'test',
        userNickname: 'test',
        agreeEssentialTerm: true,
        agreeMarketingSend: true,
        isActivate: true,
        lastLogined: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      jest.spyOn(authService, 'signUp').mockImplementation(async () => result);

      expect(
        await authController.signUp({
          userId: 'test',
          userPw: 'test',
          userName: 'test',
          userNickname: 'test',
          userEmail: 'test',
          agreeEssentialTerm: true,
          agreeMarketingSend: true,
        }),
      ).toStrictEqual(result);
    });
  });

  describe('signIn', () => {
    it('로그인 후 사용자 값을 반환합니다.', async () => {
      const result = {
        userUid: 1,
        userId: 'test',
        userPw: 'test',
        userName: 'test',
        userNickName: 'test',
        userEmail: 'test',
        userNickname: 'test',
        agreeEssentialTerm: true,
        agreeMarketingSend: true,
        isActivate: true,
        lastLogined: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      jest.spyOn(authService, 'signIn').mockImplementation(async () => result);

      expect(
        await authController.signIn(
          {
            userId: 'test',
            userPw: 'test',
          },
          null,
        ),
      ).toStrictEqual(result);
    });

    // it('존재하지 않는 사용자가 로그인을 시도하면 에러를 반환합니다.', async () => {
    //   jest
    //     .spyOn(authService, 'signIn')
    //     .mockImplementation(
    //       async () =>
    //         new Error(
    //           '존재하지 않는 사용자입니다.',
    //           HttpStatus.BAD_REQUEST,
    //         ),
    //     );

    //   expect(
    //     await authController.signIn(
    //       {
    //         userId: 'notexist',
    //         userPw: 'notexist',
    //       },
    //       null,
    //     ),
    //   ).toStrictEqual(
    //     new HttpException(
    //       '존재하지 않는 사용자입니다.',
    //       HttpStatus.BAD_REQUEST,
    //     ),
    //   );
    // });
  });
});
