import { OnboardingItem } from '../models/types';
import AppLogo from '../images/App_logo.svg';
import FirstPagePhoto from '../images/1st_page_photo.svg';
import SecondPagePhoto from '../images/2nd_page_photo.svg';
import ThirdPagePhoto from '../images/3rd_page_photo.svg';
import FourthPagePhoto from '../images/4th_page_photo.svg';

export const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'RythuMitra',
    description: '',
    image: AppLogo,
  },
  {
    id: '2',
    title: 'Smart support for your\nfarming needs',
    description: 'Get the right guidance for your land\nbased on real conditions and data\nto improve your farming results',
    image: FirstPagePhoto,
  },
  {
    id: '3',
    title: 'Know the right fertilizer\nfor your soil',
    description: 'Understand what to apply and how much\nwith simple and clear recommendations\nbased on your soil condition',
    image: SecondPagePhoto,
  },
  {
    id: '4',
    title: 'Daily farming guide\njust for you',
    description: 'Know what to do every day\nwith easy step-by-step tasks\nto grow your crops successfully',
    image: ThirdPagePhoto,
  },
  {
    id: '5',
    title: 'Choose Your Farming\nMethod',
    description: 'Connect a soil device or manually\nenter soil details to start smart\nfarming with RythuMitra.',
    image: FourthPagePhoto,
  }
];
